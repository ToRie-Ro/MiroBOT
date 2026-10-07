import { Message, TextChannel } from 'discord.js';
import { ChiroClient } from '../../client';

export async function runAutoMod(message: Message, client: ChiroClient): Promise<void> {
  if (!message.inGuild()) return;

  // Fetch bad word list from DB (cached via guild settings)
  let badWords: string[] = [];
  try {
    const settings = await client.getGuildSettings(message.guildId);
    // If automod is disabled or not configured, skip
    if (!settings) return;

    // TODO: extend getGuildSettings to include automod bad words list
    // For now use a placeholder — this gets replaced by DB-backed config
    badWords = (settings as unknown as { autoModBadWords?: string[] }).autoModBadWords ?? [];
  } catch {
    // Non-fatal — just skip automod this message
    return;
  }

  const content = message.content.toLowerCase();

  // ── Bad word filter ───────────────────────────────────────────────────
  if (badWords.length > 0 && badWords.some((word) => content.includes(word.toLowerCase()))) {
    await message.delete().catch(() => undefined);
    const channel = message.channel as TextChannel;
    const warning = await channel
      .send(`⚠️ ${message.author}, please watch your language.`)
      .catch(() => undefined);
    if (warning) setTimeout(() => warning.delete().catch(() => undefined), 4000);
    client.logger.info(
      { user: message.author.tag, guild: message.guildId },
      'AutoMod: deleted bad-word message',
    );
    return;
  }

  // ── Anti-invite link ──────────────────────────────────────────────────
  const inviteRegex = /discord(?:\.gg|app\.com\/invite|\.com\/invite)\/\S+/i;
  if (inviteRegex.test(message.content)) {
    await message.delete().catch(() => undefined);
    const channel = message.channel as TextChannel;
    const warning = await channel
      .send(`⚠️ ${message.author}, Discord invite links are not allowed here.`)
      .catch(() => undefined);
    if (warning) setTimeout(() => warning.delete().catch(() => undefined), 4000);
    return;
  }
}