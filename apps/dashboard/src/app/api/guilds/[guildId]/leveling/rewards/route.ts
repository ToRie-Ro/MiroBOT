import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../../lib/rate-limit';
import { levelRewardSchema } from '../../../../../../lib/validation';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const rewards = await prisma.levelReward.findMany({ where: { guildId: params.guildId }, orderBy: { level: 'asc' } });
    return NextResponse.json(rewards);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`leveling_reward_post_${params.guildId}`, 10, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = levelRewardSchema.parse(body);

    const created = await prisma.levelReward.create({
      data: {
        guildId: params.guildId,
        level: validated.level,
        roleId: validated.roleId,
      }
    });

    return NextResponse.json(created);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
