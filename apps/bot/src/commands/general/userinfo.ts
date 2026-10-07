import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('User info embed')
    .addUserOption(opt => opt.setName('user').setDescription('User to get info for')),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = createInfoEmbed('User Info', `Information about ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;