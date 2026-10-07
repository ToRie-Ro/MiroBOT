import { Events, Message } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { grantXP } from '../features/leveling';
import { runAutoMod } from '../features/automod';

export default {
  name: Events.MessageCreate,
  async execute(message: Message, client: ChiroClient) {
    if (message.author.bot) return;
    if (!message.inGuild()) return;

    try {
      await runAutoMod(message, client);
      await grantXP(message.author.id, message.guildId, message, client);
    } catch (err) {
      client.logger.error(err, 'Error in messageCreate');
    }
  }
} as Event;
