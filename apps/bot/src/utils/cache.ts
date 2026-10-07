import { redisClient } from './redis';
import { GuildSettings } from '../types';

export async function getGuildSettings(guildId: string): Promise<GuildSettings | null> {
  const cached = await redisClient.get(`guild_settings:${guildId}`);
  if (cached) return JSON.parse(cached);
  // Ideally fetch from DB and cache
  return null;
}

export async function invalidateGuildCache(guildId: string): Promise<void> {
  await redisClient.del(`guild_settings:${guildId}`);
}
