import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../../lib/auth-helpers';
import { prisma } from '@chiro/database';
import { rateLimit } from '../../../../../../lib/rate-limit';
import { customCommandSchema } from '../../../../../../lib/validation';

export async function GET(req: Request, { params }: { params: { guildId: string, commandId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const item = await prisma.customCommand.findUnique({ where: { id: params.commandId, guildId: params.guildId } });
    return NextResponse.json(item);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: { guildId: string, commandId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`cc_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = customCommandSchema.parse(body);
    const updated = await prisma.customCommand.update({
      where: { id: params.commandId, guildId: params.guildId },
      data: { name: validated.name.toLowerCase(), response: validated.response, description: validated.description }
    });
    return NextResponse.json(updated);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function DELETE(req: Request, { params }: { params: { guildId: string, commandId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    await prisma.customCommand.delete({ where: { id: params.commandId, guildId: params.guildId } });
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
