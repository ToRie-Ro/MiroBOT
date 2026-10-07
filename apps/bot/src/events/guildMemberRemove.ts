import { Events, GuildMember, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createWarningEmbed } from '../utils/embed';

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember, client: ChiroClient) {
    client.logger.info(`Member left: ${member.user.tag}`);
    const settings = await client.getGuildSettings(member.guild.id);
    if (settings?.goodbyeChannelId) {
      const channel = member.guild.channels.cache.get(settings.goodbyeChannelId) as TextChannel;
      if (channel) {
        const embed = createWarningEmbed('Goodbye', `${member.user.username} left the server.`);
        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;