import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../lib/auth-helpers';
import { fetchUserGuilds } from '../../../lib/discord-api';
import { getCache, setCache } from '../../../lib/redis';
import { rateLimit } from '../../../lib/rate-limit';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    // @ts-ignore
    const { success } = await rateLimit(`guilds_get_${session.user.id}`, 20, 60);
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // @ts-ignore
    const cacheKey = `user_guilds:${session.user.id}`;
    let guilds = await getCache(cacheKey);

    if (!guilds) {
      // @ts-ignore
      guilds = await fetchUserGuilds(session.accessToken);
      await setCache(cacheKey, guilds, 60);
    }

    if (!Array.isArray(guilds)) {
      return NextResponse.json([]);
    }

    // Filter to guilds where user has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) or is owner
    const managedGuilds = guilds.filter((g: any) => {
      try {
        const perms = BigInt(g.permissions || '0');
        const MANAGE_GUILD = BigInt(0x20);
        const ADMINISTRATOR = BigInt(0x8);
        return g.owner || (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
      } catch {
        return !!g.owner;
      }
    });

    const botToken = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;

    const guildsWithBot = await Promise.all(
      managedGuilds.map(async (g: any) => {
        let botPresent = false;
        if (botToken) {
          try {
            const res = await fetch(`https://discord.com/api/v10/guilds/${g.id}`, {
              headers: { Authorization: `Bot ${botToken}` },
            });
            botPresent = res.ok;
          } catch {}
        }
        return { ...g, botPresent };
      })
    );

    return NextResponse.json(guildsWithBot);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
