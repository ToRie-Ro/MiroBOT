import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../lib/auth-helpers';
import { rateLimit } from '../../../../lib/rate-limit';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    // @ts-ignore
    const { success } = await rateLimit(`guild_${params.guildId}`, 10, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const guildSettings = await prisma.guild.findUnique({
      where: { id: params.guildId },
      include: {
        welcomeSettings: true,
        goodbyeSettings: true,
        moderationSettings: true,
        autoModSettings: true,
        logSettings: true,
        levelSettings: true,
        ticketSettings: true,
        tempVoiceSettings: true,
      }
    });

    if (!guildSettings) return NextResponse.json({ error: 'Guild not found' }, { status: 404 });
    return NextResponse.json(guildSettings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 500 });
  }
}
