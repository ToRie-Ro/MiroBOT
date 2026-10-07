import { NextResponse } from 'next/server';
import { getAuthSession, requireOwner } from '../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';

export async function GET() {
  try {
    const session = await getAuthSession();
    await requireOwner(session);

    const totalGuilds = await prisma.guild.count();
    const totalUsers = await prisma.user.count();
    
    return NextResponse.json({
      totalGuilds,
      totalUsers,
      uptime: process.uptime(),
      commandsUsed: 10243, // Mock data
      errors: 12, // Mock data
    });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 403 }); }
}
