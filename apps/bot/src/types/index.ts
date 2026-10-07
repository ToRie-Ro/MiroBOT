import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  category: string;
  premium?: boolean;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute(...args: any[]): Promise<void>;
}

export interface GuildSettings {
  id: string;
  prefix: string;
  logChannelId?: string;
  welcomeChannelId?: string;
  goodbyeChannelId?: string;
  badWords: string[];
}

export type Feature = {
  name: string;
  init(...args: any[]): void;
};
