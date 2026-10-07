const fs = require('fs');
const path = require('path');

const files = [
  // EVENTS
  {
    path: 'events/guildDelete.ts',
    content: `import { Events, Guild } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

export default {
  name: Events.GuildDelete,
  async execute(guild: Guild, client: ChiroClient) {
    client.logger.info(\`Left guild: \${guild.name} (\${guild.id})\`);
    // DB: update guild record to mark as inactive
  }
} as Event;`
  },
  {
    path: 'events/guildMemberAdd.ts',
    content: `import { Events, GuildMember, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createSuccessEmbed } from '../utils/embed';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client: ChiroClient) {
    client.logger.info(\`Member joined: \${member.user.tag}\`);
    const settings = await client.getGuildSettings(member.guild.id);
    if (settings?.welcomeChannelId) {
      const channel = member.guild.channels.cache.get(settings.welcomeChannelId) as TextChannel;
      if (channel) {
        const embed = createSuccessEmbed('Welcome!', \`Welcome \${member.user.username} to \${member.guild.name}!\`);
        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/guildMemberRemove.ts',
    content: `import { Events, GuildMember, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createWarningEmbed } from '../utils/embed';

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember, client: ChiroClient) {
    client.logger.info(\`Member left: \${member.user.tag}\`);
    const settings = await client.getGuildSettings(member.guild.id);
    if (settings?.goodbyeChannelId) {
      const channel = member.guild.channels.cache.get(settings.goodbyeChannelId) as TextChannel;
      if (channel) {
        const embed = createWarningEmbed('Goodbye', \`\${member.user.username} left the server.\`);
        await channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/messageCreate.ts',
    content: `import { Events, Message } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { grantXP } from '../features/leveling';
import { runAutoMod } from '../features/automod';

export default {
  name: Events.MessageCreate,
  async execute(message: Message, client: ChiroClient) {
    if (message.author.bot) return;
    if (!message.inGuild()) return;

    try {
      await runAutoMod(message, client);
      await grantXP(message.author.id, message.guildId, message, client);
    } catch (err) {
      client.logger.error(err, 'Error in messageCreate');
    }
  }
} as Event;`
  },
  {
    path: 'events/messageDelete.ts',
    content: `import { Events, Message, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createWarningEmbed } from '../utils/embed';

export default {
  name: Events.MessageDelete,
  async execute(message: Message, client: ChiroClient) {
    if (!message.inGuild() || message.author?.bot) return;
    const settings = await client.getGuildSettings(message.guildId);
    if (settings?.logChannelId) {
      const logChannel = message.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createWarningEmbed('Message Deleted', \`A message by \${message.author?.tag} was deleted in \${message.channel}\\n\\nContent: \${message.content || '[No Content]'}\`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/messageUpdate.ts',
    content: `import { Events, Message, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createInfoEmbed } from '../utils/embed';

export default {
  name: Events.MessageUpdate,
  async execute(oldMessage: Message, newMessage: Message, client: ChiroClient) {
    if (!oldMessage.inGuild() || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const settings = await client.getGuildSettings(newMessage.guildId);
    if (settings?.logChannelId) {
      const logChannel = newMessage.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createInfoEmbed('Message Edited', \`A message by \${newMessage.author?.tag} was edited in \${newMessage.channel}\\n\\nOld: \${oldMessage.content}\\nNew: \${newMessage.content}\`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/guildBanAdd.ts',
    content: `import { Events, GuildBan, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createErrorEmbed } from '../utils/embed';

export default {
  name: Events.GuildBanAdd,
  async execute(ban: GuildBan, client: ChiroClient) {
    const settings = await client.getGuildSettings(ban.guild.id);
    if (settings?.logChannelId) {
      const logChannel = ban.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createErrorEmbed('User Banned', \`\${ban.user.tag} was banned. Reason: \${ban.reason || 'None'}\`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/guildBanRemove.ts',
    content: `import { Events, GuildBan, TextChannel } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { createSuccessEmbed } from '../utils/embed';

export default {
  name: Events.GuildBanRemove,
  async execute(ban: GuildBan, client: ChiroClient) {
    const settings = await client.getGuildSettings(ban.guild.id);
    if (settings?.logChannelId) {
      const logChannel = ban.guild.channels.cache.get(settings.logChannelId) as TextChannel;
      if (logChannel) {
        const embed = createSuccessEmbed('User Unbanned', \`\${ban.user.tag} was unbanned.\`);
        await logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
} as Event;`
  },
  {
    path: 'events/voiceStateUpdate.ts',
    content: `import { Events, VoiceState } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';
import { handleTempVoice } from '../features/tempvoice';

export default {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState, client: ChiroClient) {
    try {
      await handleTempVoice(oldState, newState, client);
    } catch (err) {
      client.logger.error(err, 'Error in voiceStateUpdate');
    }
  }
} as Event;`
  },
  {
    path: 'events/guildMemberUpdate.ts',
    content: `import { Events, GuildMember } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

export default {
  name: Events.GuildMemberUpdate,
  async execute(oldMember: GuildMember, newMember: GuildMember, client: ChiroClient) {
    // Handle role or nickname changes logging
  }
} as Event;`
  },
  // GENERAL COMMANDS
  {
    path: 'commands/general/help.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
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
        { name: 'General', value: '\`/ping\`, \`/help\`, \`/serverinfo\`, \`/userinfo\`, \`/avatar\`' },
        { name: 'Moderation', value: '\`/ban\`, \`/kick\`, \`/timeout\`, \`/warn\`, \`/clear\`, \`/slowmode\`, \`/lock\`' }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;`
  },
  {
    path: 'commands/general/serverinfo.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Server stats embed'),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const embed = createInfoEmbed('Server Info', \`Stats for \${interaction.guild.name}\`)
      .addFields(
        { name: 'Members', value: \`\${interaction.guild.memberCount}\`, inline: true },
        { name: 'Created', value: \`\${interaction.guild.createdAt.toDateString()}\`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;`
  },
  {
    path: 'commands/general/userinfo.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('User info embed')
    .addUserOption(opt => opt.setName('user').setDescription('User to get info for')),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = createInfoEmbed('User Info', \`Information about \${user.tag}\`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
} as Command;`
  },
  {
    path: 'commands/general/avatar.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Shows user avatar')
    .addUserOption(opt => opt.setName('user').setDescription('User to get avatar for')),
  category: 'general',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = createInfoEmbed('Avatar', \`\${user.tag}'s avatar\`).setImage(user.displayAvatarURL({ size: 512 }));
    await interaction.reply({ embeds: [embed] });
  }
} as Command;`
  },
  // MODERATION COMMANDS (Samples)
  {
    path: 'commands/moderation/ban.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
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
      await interaction.reply({ embeds: [createSuccessEmbed('Banned', \`Banned \${target.tag} for \${reason}\`)] });
    } catch (err) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Could not ban user.')], ephemeral: true });
    }
  }
} as Command;`
  },
  {
    path: 'commands/moderation/kick.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
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
      await interaction.reply({ embeds: [createSuccessEmbed('Kicked', \`Kicked \${target.tag} for \${reason}\`)] });
    } catch (err) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Could not kick user.')], ephemeral: true });
    }
  }
} as Command;`
  },
  {
    path: 'commands/moderation/clear.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
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
      await interaction.reply({ embeds: [createSuccessEmbed('Cleared', \`Cleared \${amount} messages.\`)], ephemeral: true });
    }
  }
} as Command;`
  },
  // LEVELING COMMANDS
  {
    path: 'commands/leveling/rank.ts',
    content: `import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';
import { createInfoEmbed } from '../../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Show rank card')
    .addUserOption(opt => opt.setName('user').setDescription('User to check')),
  category: 'leveling',
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({ embeds: [createInfoEmbed('Rank', \`\${user.tag} rank info will go here\`)] });
  }
} as Command;`
  },
  // FEATURES
  {
    path: 'features/automod/index.ts',
    content: `import { Message } from 'discord.js';
import { ChiroClient } from '../../client';

export async function runAutoMod(message: Message, client: ChiroClient) {
  // Simple automod implementation
  const badWords = ['badword1', 'badword2']; // Fetch from DB ideally
  if (badWords.some(word => message.content.includes(word))) {
    await message.delete().catch(() => {});
    await message.channel.send(\`\${message.author}, please refrain from using bad words!\`).then(m => setTimeout(() => m.delete(), 3000));
  }
}`
  },
  {
    path: 'features/leveling/index.ts',
    content: `import { Message } from 'discord.js';
import { ChiroClient } from '../../client';

export async function grantXP(userId: string, guildId: string, message: Message, client: ChiroClient) {
  const cdKey = \`xp_cd:\${guildId}:\${userId}\`;
  const inCd = await client.redis.get(cdKey);
  if (inCd) return;
  
  await client.redis.setex(cdKey, 60, '1'); // 60s cooldown
  // Give XP logic... DB update
  client.logger.info(\`Granted XP to \${userId}\`);
}`
  },
  {
    path: 'features/giveaways/index.ts',
    content: `export function initGiveaways() {
  // Setup cron jobs for giveaways
}`
  },
  {
    path: 'features/tickets/index.ts',
    content: `export function initTickets() {
  // Setup ticket logic
}`
  },
  {
    path: 'features/tempvoice/index.ts',
    content: `import { VoiceState } from 'discord.js';
import { ChiroClient } from '../../client';

export async function handleTempVoice(oldState: VoiceState, newState: VoiceState, client: ChiroClient) {
  // Temp voice logic
}`
  }
];

const basePath = 'C:\\\\Users\\\\Chiro\\\\.gemini\\\\antigravity\\\\scratch\\\\chiro\\\\apps\\\\bot\\\\src';

files.forEach(file => {
  const fullPath = path.join(basePath, file.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, file.content);
  console.log('Created:', fullPath);
});
