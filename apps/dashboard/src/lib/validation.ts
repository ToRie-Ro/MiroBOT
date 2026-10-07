import { z } from 'zod';

export const welcomeSettingsSchema = z.object({
  enabled: z.boolean(),
  channelId: z.string().nullable(),
  message: z.string().max(2000),
});

export const goodbyeSettingsSchema = welcomeSettingsSchema;

export const moderationSettingsSchema = z.object({
  muteRoleId: z.string().nullable(),
  ignoredChannels: z.array(z.string()),
  ignoredRoles: z.array(z.string()),
});

export const autoModSettingsSchema = z.object({
  antiSpamEnabled: z.boolean(),
  antiLinkEnabled: z.boolean(),
  antiInviteEnabled: z.boolean(),
  antiBadWordsEnabled: z.boolean(),
  badWords: z.array(z.string()),
  action: z.enum(['WARN', 'MUTE', 'KICK', 'BAN']),
});

export const logSettingsSchema = z.object({
  enabled: z.boolean(),
  channelId: z.string().nullable(),
  events: z.array(z.string()),
});

export const announcementSchema = z.object({
  channelId: z.string(),
  message: z.string().max(2000),
  scheduledAt: z.string().datetime().optional(),
});

export const autoRoleSchema = z.object({
  roleId: z.string(),
  delay: z.number().min(0),
});

export const reactionRolePanelSchema = z.object({
  channelId: z.string(),
  title: z.string().max(256),
  description: z.string().max(2048),
  roles: z.array(
    z.object({
      emoji: z.string(),
      roleId: z.string(),
      label: z.string().optional(),
    })
  ).max(20),
});

export const levelSettingsSchema = z.object({
  enabled: z.boolean(),
  announcementChannel: z.string().nullable(),
  multiplier: z.number().min(0.1).max(5),
});

export const levelRewardSchema = z.object({
  level: z.number().min(1),
  roleId: z.string(),
});

export const customCommandSchema = z.object({
  name: z.string().min(1).max(32),
  response: z.string().max(2000),
  description: z.string().max(100).optional(),
});

export const ticketSettingsSchema = z.object({
  enabled: z.boolean(),
  categoryId: z.string().nullable(),
  supportRoleId: z.string().nullable(),
  logChannelId: z.string().nullable(),
  welcomeMessage: z.string().max(2000),
});

export const giveawaySchema = z.object({
  channelId: z.string(),
  prize: z.string().max(256),
  winnerCount: z.number().min(1),
  durationMs: z.number().min(60000),
});

export const embedTemplateSchema = z.object({
  name: z.string().max(50),
  title: z.string().max(256).optional(),
  description: z.string().max(2048).optional(),
  color: z.number().optional(),
});

export const guildSettingsSchema = z.object({
  prefix: z.string().max(5),
  language: z.string().max(5),
  timezone: z.string().max(50),
});

export const tempVoiceSettingsSchema = z.object({
  enabled: z.boolean(),
  categoryId: z.string().nullable(),
  generatorChannelId: z.string().nullable(),
  nameTemplate: z.string().max(50),
});
