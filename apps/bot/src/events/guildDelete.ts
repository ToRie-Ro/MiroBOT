import { Events, Guild } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

export default {
  name: Events.GuildDelete,
  async execute(guild: Guild, client: ChiroClient) {
    client.logger.info(`Left guild: ${guild.name} (${guild.id})`);
    // DB: update guild record to mark as inactive
  }
} as Event;
