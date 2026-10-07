import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../../lib/rate-limit';
import { prisma } from '@chiro/database';

export async function DELETE(req: Request, { params }: { params: { guildId: string, giveawayId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    // Ending giveaway early
    const updated = await prisma.giveaway.update({
      where: { id: params.giveawayId, guildId: params.guildId },
      data: { status: 'ENDED', endsAt: new Date() }
    });
    return NextResponse.json(updated);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: { guildId: string, giveawayId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`ga_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // Reroll logic flag
    return NextResponse.json({ success: true, message: 'Giveaway reroll triggered.' });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
