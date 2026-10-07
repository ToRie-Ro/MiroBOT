import { Events } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

const readyEvent: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: ChiroClient) {
    client.logger.info(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity('Watching over Chiro!');
    
    // Start cron jobs or other background tasks here
    client.logger.info('Bot is fully initialized and ready.');
  },
};

export default readyEvent;
