import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../lib/rate-limit';
import { giveawaySchema } from '../../../../../lib/validation';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const giveaways = await prisma.giveaway.findMany({ where: { guildId: params.guildId } });
    return NextResponse.json(giveaways);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`giveaways_post_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = giveawaySchema.parse(body);

    const endsAt = new Date(Date.now() + validated.durationMs);

    const created = await prisma.giveaway.create({
      data: {
        guildId: params.guildId,
        channelId: validated.channelId,
        prize: validated.prize,
        winnerCount: validated.winnerCount,
        endsAt,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json(created);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
