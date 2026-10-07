import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  category: 'moderation',
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return;
    try {
      await interaction.guild?.members.kick(target, reason);
      await interaction.reply({ embeds: [createSuccessEmbed('Kicked', `Kicked ${target.tag} for ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Could not kick user.')], ephemeral: true });
    }
  }
} as Command;