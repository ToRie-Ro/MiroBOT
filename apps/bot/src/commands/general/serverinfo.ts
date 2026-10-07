import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Server stats embed'),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const embed = createInfoEmbed('Server Info', `Stats for ${interaction.guild.name}`)
      .addFields(
        { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
        { name: 'Created', value: `${interaction.guild.createdAt.toDateString()}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;