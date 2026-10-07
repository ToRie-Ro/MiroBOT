import { Events, Guild, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createSuccessEmbed } from '../utils/embed';

const guildCreateEvent: Event = {
  name: Events.GuildCreate,
  async execute(guild: Guild, client: ChiroClient) {
    client.logger.info(`Joined new guild: ${guild.name} (${guild.id})`);
    
    // In a real scenario, create Guild record in DB here
    
    // Find system channel or first writable channel
    const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me!)?.has('SendMessages'));
    
    if (channel && channel.isTextBased()) {
      const embed = createSuccessEmbed('Thanks for adding Chiro!', 'Use `/help` to get started with the bot. Please configure your settings.');
      await (channel as TextChannel).send({ embeds: [embed] });
    }
  },
};

export default guildCreateEvent;
