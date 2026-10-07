import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../lib/rate-limit';
import { levelSettingsSchema } from '../../../../../lib/validation';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const settings = await prisma.levelSettings.findUnique({ where: { guildId: params.guildId } });
    return NextResponse.json(settings || { enabled: false, announcementChannel: null, multiplier: 1.0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`leveling_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = levelSettingsSchema.parse(body);

    const updated = await prisma.levelSettings.upsert({
      where: { guildId: params.guildId },
      update: validated,
      create: { guildId: params.guildId, ...validated },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
