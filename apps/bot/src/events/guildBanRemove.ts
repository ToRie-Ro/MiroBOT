import { Events, GuildBan, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createSuccessEmbed } from '../utils/embed';

export default {
  name: Events.GuildBanRemove,
  async execute(ban: GuildBan, client: ChiroClient) {
    const settings = await client.getGuildSettings(ban.guild.id);
    if (settings?.logChannelId) {
      const logChannel = ban.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createSuccessEmbed('User Unbanned', `${ban.user.tag} was unbanned.`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;