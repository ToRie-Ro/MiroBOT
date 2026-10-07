import { Message } from 'discord.js';
import { ChiroClient } from '../../client';

export async function runAutoMod(message: Message, client: ChiroClient) {
  // Simple automod implementation
  const badWords = ['badword1', 'badword2']; // Fetch from DB ideally
  if (badWords.some(word => message.content.includes(word))) {
    await message.delete().catch(() => {});
    await message.channel.send(`${message.author}, please refrain from using bad words!`).then(m => setTimeout(() => m.delete(), 3000));
  }
}
