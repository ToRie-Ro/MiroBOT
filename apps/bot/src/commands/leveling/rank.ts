import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Show rank card')
    .addUserOption(opt => opt.setName('user').setDescription('User to check')),
  category: 'leveling',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({ embeds: [createInfoEmbed('Rank', `${user.tag} rank info will go here`)] });
  }
} as Command;