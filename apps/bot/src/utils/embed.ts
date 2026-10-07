import { EmbedBuilder, ColorResolvable } from 'discord.js';

const BRAND_COLOR: ColorResolvable = '#5865F2';
const SUCCESS_COLOR: ColorResolvable = '#57F287';
const ERROR_COLOR: ColorResolvable = '#ED4245';
const WARNING_COLOR: ColorResolvable = '#FEE75C';

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(SUCCESS_COLOR)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createErrorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(ERROR_COLOR)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createInfoEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createWarningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(WARNING_COLOR)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}
