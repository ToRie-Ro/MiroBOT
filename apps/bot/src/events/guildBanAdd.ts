import { Events, GuildBan, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createErrorEmbed } from '../utils/embed';

export default {
  name: Events.GuildBanAdd,
  async execute(ban: GuildBan, client: ChiroClient) {
    const settings = await client.getGuildSettings(ban.guild.id);
    if (settings?.logChannelId) {
      const logChannel = ban.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createErrorEmbed('User Banned', `${ban.user.tag} was banned. Reason: ${ban.reason || 'None'}`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;