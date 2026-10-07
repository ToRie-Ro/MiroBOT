import { NextResponse } from 'next/server';
import { prisma } from '@chiro/database';
import { redis } from '../../lib/redis';

export async function GET() {
  try {
    const startDb = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startDb;

    const startRedis = Date.now();
    await redis.ping();
    const redisLatency = Date.now() - startRedis;

    // Discord API ping mock check
    const startDiscord = Date.now();
    await fetch('https://discord.com/api/v10/gateway');
    const discordLatency = Date.now() - startDiscord;

    return NextResponse.json([
      { service: 'Database', status: 'online', latency: dbLatency },
      { service: 'Redis', status: 'online', latency: redisLatency },
      { service: 'Discord API', status: 'online', latency: discordLatency },
    ]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Service Unavailable', details: error.message }, { status: 503 });
  }
}
