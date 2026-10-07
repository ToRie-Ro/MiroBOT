import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Logger } from 'pino';
import Redis from 'ioredis';
import { Command, GuildSettings } from './types';
import { logger } from './utils/logger';
import { redisClient } from './utils/redis';

export class ChiroClient extends Client {
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
  redis: Redis;
  logger: Logger;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
      ],
    });

    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.redis = redisClient;
    this.logger = logger;
  }

  async getGuildSettings(guildId: string): Promise<GuildSettings | null> {
    const cached = await this.redis.get(`guild_settings:${guildId}`);
    if (cached) return JSON.parse(cached);
    return null;
  }
}
