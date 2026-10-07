import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  category: 'moderation',
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return;
    try {
      await interaction.guild?.members.ban(target, { reason });
      await interaction.reply({ embeds: [createSuccessEmbed('Banned', `Banned ${target.tag} for ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Could not ban user.')], ephemeral: true });
    }
  }
} as Command;