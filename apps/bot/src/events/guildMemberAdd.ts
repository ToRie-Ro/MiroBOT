import { Events, GuildMember, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createSuccessEmbed } from '../utils/embed';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client: ChiroClient) {
    client.logger.info(`Member joined: ${member.user.tag}`);
    const settings = await client.getGuildSettings(member.guild.id);
    if (settings?.welcomeChannelId) {
      const channel = member.guild.channels.cache.get(settings.welcomeChannelId) as TextChannel;
      if (channel) {
        const embed = createSuccessEmbed('Welcome!', `Welcome ${member.user.username} to ${member.guild.name}!`);
        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;