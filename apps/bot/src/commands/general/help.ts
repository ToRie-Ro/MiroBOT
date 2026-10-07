import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all commands with descriptions'),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = createInfoEmbed('Help Menu', 'Here are all the commands you can use.')
      .addFields(
        { name: 'General', value: '`/ping`, `/help`, `/serverinfo`, `/userinfo`, `/avatar`' },
        { name: 'Moderation', value: '`/ban`, `/kick`, `/timeout`, `/warn`, `/clear`, `/slowmode`, `/lock`' }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;