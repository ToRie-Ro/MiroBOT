import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../types';
import { createSuccessEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to delete').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: 'moderation',
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount', true);
    const channel = interaction.channel as TextChannel;
    if (channel) {
      await channel.bulkDelete(amount, true);
      await interaction.reply({ embeds: [createSuccessEmbed('Cleared', `Cleared ${amount} messages.`)], ephemeral: true });
    }
  }
} as Command;