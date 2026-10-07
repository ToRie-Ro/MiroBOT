import { Events, Message, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createWarningEmbed } from '../utils/embed';

export default {
  name: Events.MessageDelete,
  async execute(message: Message, client: ChiroClient) {
    if (!message.inGuild() || message.author?.bot) return;
    const settings = await client.getGuildSettings(message.guildId);
    if (settings?.logChannelId) {
      const logChannel = message.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createWarningEmbed('Message Deleted', `A message by ${message.author?.tag} was deleted in ${message.channel}\n\nContent: ${message.content || '[No Content]'}`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;