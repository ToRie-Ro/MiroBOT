import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../lib/auth-helpers';
import { fetchUserGuilds } from '../../../lib/discord-api';
import { getCache, setCache } from '../../../lib/redis';
import { rateLimit } from '../../../lib/rate-limit';

// Mock DB call for testing without actual DB setup
const isBotInGuild = async (guildId: string) => true; 

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    // @ts-ignore
    const { success } = await rateLimit(`guilds_get_${session.user.id}`, 10, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // @ts-ignore
    const cacheKey = `user_guilds:${session.user.id}`;
    let guilds = await getCache(cacheKey);

    if (!guilds) {
      // @ts-ignore
      guilds = await fetchUserGuilds(session.accessToken);
      await setCache(cacheKey, guilds, 300);
    }

    const managedGuilds = guilds.filter((g: any) => (g.permissions & 0x20) === 0x20);
    
    const guildsWithBot = await Promise.all(
      managedGuilds.map(async (g: any) => {
        const botPresent = await isBotInGuild(g.id);
        return { ...g, botPresent };
      })
    );

    return NextResponse.json(guildsWithBot);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
