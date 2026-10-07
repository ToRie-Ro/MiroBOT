import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../lib/rate-limit';
import { guildSettingsSchema } from '../../../../../lib/validation';
import { prisma } from '@chiro/database';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const settings = await prisma.guild.findUnique({ where: { id: params.guildId } });
    return NextResponse.json({ prefix: settings?.prefix || '!', language: settings?.language || 'en', timezone: settings?.timezone || 'UTC' });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const { success } = await rateLimit(`settings_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = guildSettingsSchema.parse(body);

    const updated = await prisma.guild.update({
      where: { id: params.guildId },
      data: validated,
    });
    return NextResponse.json(updated);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
