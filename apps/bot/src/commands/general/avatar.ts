import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Shows user avatar')
    .addUserOption(opt => opt.setName('user').setDescription('User to get avatar for')),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = createInfoEmbed('Avatar', `${user.tag}'s avatar`).setImage(user.displayAvatarURL({ size: 512 }));
    await interaction.reply({ embeds: [embed] });
  }
} as Command;