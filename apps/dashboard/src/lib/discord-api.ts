const DISCORD_API_URL = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;

export async function fetchUserGuilds(accessToken: string) {
  const res = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch user guilds');
  return res.json();
}

export async function fetchGuildChannels(guildId: string) {
  const res = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
  if (!res.ok) throw new Error('Failed to fetch guild channels');
  return res.json();
}

export async function fetchGuildRoles(guildId: string) {
  const res = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
  if (!res.ok) throw new Error('Failed to fetch guild roles');
  return res.json();
}

export async function sendMessage(channelId: string, content: string, embeds: any[] = []) {
  const res = await fetch(`${DISCORD_API_URL}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, embeds }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}
