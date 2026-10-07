import { NextResponse } from 'next/server';
import { getAuthSession, requireGuildPermission } from '../../../../../lib/auth-helpers';
import { fetchGuildChannels } from '../../../../../lib/discord-api';
import { getCache, setCache } from '../../../../../lib/redis';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const session = await getAuthSession();
    await requireGuildPermission(params.guildId, session);
    
    const cacheKey = `guild_channels:${params.guildId}`;
    let channels = await getCache(cacheKey);

    if (!channels) {
      channels = await fetchGuildChannels(params.guildId);
      await setCache(cacheKey, channels, 300); // 5 min cache
    }

    const textChannels = channels.filter((c: any) => c.type === 0);
    const voiceChannels = channels.filter((c: any) => c.type === 2);
    
    return NextResponse.json({ textChannels, voiceChannels });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
