import { Message } from 'discord.js';
import { ChiroClient } from '../../client';

export async function grantXP(userId: string, guildId: string, message: Message, client: ChiroClient) {
  const cdKey = `xp_cd:${guildId}:${userId}`;
  const inCd = await client.redis.get(cdKey);
  if (inCd) return;
  
  await client.redis.setex(cdKey, 60, '1'); // 60s cooldown
  // Give XP logic... DB update
  client.logger.info(`Granted XP to ${userId}`);
}