import { createClient } from 'redis';

const globalForRedis = global as unknown as {
  redisClient: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redisClient ??
  createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = redis;

if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttl = 300) => {
  await redis.set(key, JSON.stringify(value), { EX: ttl });
};

export const invalidateCache = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};
