import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';

export async function DELETE(req: Request, { params }: { params: { guildId: string, roleId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);

    await prisma.autoRole.deleteMany({
      where: { roleId: params.roleId, guildId: params.guildId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
