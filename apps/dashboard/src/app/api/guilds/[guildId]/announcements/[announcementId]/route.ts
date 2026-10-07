import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../../lib/rate-limit';
import { announcementSchema } from '../../../../../../lib/validation';
import { prisma } from '@chiro/database';

export async function DELETE(req: Request, { params }: { params: { guildId: string, announcementId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);

    await prisma.announcement.delete({
      where: { id: params.announcementId, guildId: params.guildId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { guildId: string, announcementId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    // @ts-ignore
    const { success } = await rateLimit(`announcement_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = announcementSchema.parse(body);

    const updated = await prisma.announcement.update({
      where: { id: params.announcementId, guildId: params.guildId },
      data: {
        channelId: validated.channelId,
        message: validated.message,
        scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
