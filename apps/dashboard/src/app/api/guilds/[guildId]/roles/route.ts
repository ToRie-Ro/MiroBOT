import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { fetchGuildRoles } from '../../../../../lib/discord-api';
import { getCache, setCache } from '../../../../../lib/redis';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    const cacheKey = `guild_roles:${params.guildId}`;
    let roles = await getCache(cacheKey);

    if (!roles) {
      roles = await fetchGuildRoles(params.guildId);
      await setCache(cacheKey, roles, 300); // 5 min cache
    }

    return NextResponse.json(roles);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
