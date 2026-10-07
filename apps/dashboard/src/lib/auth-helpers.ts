import { auth } from '../auth';
import { fetchUserGuilds } from './discord-api';
import { getCache, setCache } from './redis';

export async function getAuthSession() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireGuildPermission(guildId: string, session: any) {
  const accessToken = session.accessToken;
  const cacheKey = `user_guilds:${session.user.id}`;
  let guilds = await getCache(cacheKey);

  if (!guilds) {
    guilds = await fetchUserGuilds(accessToken);
    await setCache(cacheKey, guilds, 300);
  }

  const guild = guilds.find((g: any) => g.id === guildId);
  if (!guild || (guild.permissions & 0x20) !== 0x20) {
    throw new Error('Forbidden: Manage Server permission required');
  }
  return true;
}

export async function requireOwner(session: any) {
  const BOT_OWNER_IDS = (process.env.BOT_OWNER_IDS || '').split(',');
  if (!BOT_OWNER_IDS.includes(session.user.id)) {
    throw new Error('Forbidden: Bot Owner required');
  }
  return true;
}
