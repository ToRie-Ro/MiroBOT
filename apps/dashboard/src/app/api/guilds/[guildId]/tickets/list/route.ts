import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const tickets = await prisma.ticket.findMany({ 
      where: { guildId: params.guildId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(tickets);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
