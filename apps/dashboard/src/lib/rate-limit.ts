import { redis } from './redis';

export async function rateLimit(identifier: string, limit: number, windowSec: number) {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSec * 1000;

  await redis.zRemRangeByScore(key, 0, windowStart);
  
  const requestCount = await redis.zCard(key);
  
  if (requestCount >= limit) {
    return { success: false, remaining: 0, reset: windowStart + windowSec * 1000 };
  }
  
  await redis.zAdd(key, { score: now, value: now.toString() });
  await redis.expire(key, windowSec);
  
  return {
    success: true,
    remaining: Math.max(0, limit - (requestCount + 1)),
    reset: now + windowSec * 1000,
  };
}
