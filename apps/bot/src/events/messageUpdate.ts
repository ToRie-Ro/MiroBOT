import { Events, Message, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createInfoEmbed } from '../utils/embed';

export default {
  name: Events.MessageUpdate,
  async execute(oldMessage: Message, newMessage: Message, client: ChiroClient) {
    if (!oldMessage.inGuild() || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const settings = await client.getGuildSettings(newMessage.guildId);
    if (settings?.logChannelId) {
      const logChannel = newMessage.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createInfoEmbed('Message Edited', `A message by ${newMessage.author?.tag} was edited in ${newMessage.channel}\n\nOld: ${oldMessage.content}\nNew: ${newMessage.content}`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;