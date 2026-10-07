import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | undefined;
};

export const redis =
  globalForRedis.redisClient ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = redis;

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key: string, value: any, ttl = 300) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {
    // Graceful fallback
  }
};

export const invalidateCache = async (pattern: string) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Graceful fallback
  }
};
