import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { rateLimit } from '../../../../../lib/rate-limit';
import { welcomeSettingsSchema } from '../../../../../lib/validation';
import { prisma } from '@chiro/database';
import { invalidateCache } from '../../../../../lib/redis';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    const settings = await prisma.welcomeSettings.findUnique({ where: { guildId: params.guildId } });
    return NextResponse.json(settings || { enabled: false, channelId: null, message: '' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    // @ts-ignore
    const { success } = await rateLimit(`welcome_put_${params.guildId}`, 5, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await req.json();
    const validated = welcomeSettingsSchema.parse(body);

    const updated = await prisma.welcomeSettings.upsert({
      where: { guildId: params.guildId },
      update: validated,
      create: { guildId: params.guildId, ...validated },
    });

    await invalidateCache(`guild:${params.guildId}:welcome`);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
