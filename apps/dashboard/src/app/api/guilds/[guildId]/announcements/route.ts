import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../lib/rate-limit';
import { announcementSchema } from '../../../../../lib/validation';
import { sendMessage } from '../../../../../lib/discord-api';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const announcements = await prisma.announcement.findMany({ where: { guildId: params.guildId } });
    return NextResponse.json(announcements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    // @ts-ignore
    const { success } = await rateLimit(`announcements_post_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = announcementSchema.parse(body);

    if (!validated.scheduledAt) {
      await sendMessage(validated.channelId, validated.message);
      return NextResponse.json({ success: true, status: 'sent' });
    }

    const created = await prisma.announcement.create({
      data: {
        guildId: params.guildId,
        channelId: validated.channelId,
        message: validated.message,
        scheduledAt: new Date(validated.scheduledAt),
      }
    });

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
