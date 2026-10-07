import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';
import { rateLimit } from '../../../../../../lib/rate-limit';
import { reactionRolePanelSchema } from '../../../../../../lib/validation';

export async function GET(req: Request, { params }: { params: { guildId: string, panelId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const panel = await prisma.reactionRolePanel.findUnique({ where: { id: params.panelId, guildId: params.guildId } });
    return NextResponse.json(panel);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: { guildId: string, panelId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`rr_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = reactionRolePanelSchema.parse(body);
    const updated = await prisma.reactionRolePanel.update({
      where: { id: params.panelId, guildId: params.guildId },
      data: validated
    });
    return NextResponse.json(updated);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function DELETE(req: Request, { params }: { params: { guildId: string, panelId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    await prisma.reactionRolePanel.delete({ where: { id: params.panelId, guildId: params.guildId } });
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
