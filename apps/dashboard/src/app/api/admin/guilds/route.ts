import { NextResponse } from 'next/server';
import { getAuthSession, requireOwner } from '../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';

export async function GET() {
  try {
    const session = await getAuthSession();
    await requireOwner(session);

    const guilds = await prisma.guild.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
    
    return NextResponse.json(guilds);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 403 }); }
}
