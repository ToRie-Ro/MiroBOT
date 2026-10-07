// Types
export interface GuildConfig {
  prefix: string;
  language: string;
  timezone: string;
}

export interface WelcomeConfig {
  enabled: boolean;
  channelId?: string | null;
  message?: string | null;
  embedTitle?: string | null;
  embedDescription?: string | null;
  embedColor?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  footer?: string | null;
  mentionUser: boolean;
  autoRoleIds: string[];
  dmMessage?: string | null;
  dmEnabled: boolean;
}

// Constants
export const BOT_PERMISSIONS = {
  ADMINISTRATOR: 8n,
  MANAGE_GUILD: 32n,
  MANAGE_CHANNELS: 16n,
  MANAGE_ROLES: 268435456n,
  MANAGE_MESSAGES: 8192n,
  KICK_MEMBERS: 2n,
  BAN_MEMBERS: 4n,
  MODERATE_MEMBERS: 1099511627776n,
};

export const PERMISSION_FLAGS = {
  ...BOT_PERMISSIONS
};

export const XP_CONSTANTS = {
  BASE_XP: 100,
  MULTIPLIER: 1.5,
};

export const PREMIUM_LIMITS = {
  FREE: {
    CUSTOM_COMMANDS: 10,
    REACTION_ROLES: 5,
    AUTO_ROLES: 2,
  },
  PRO: {
    CUSTOM_COMMANDS: 50,
    REACTION_ROLES: 25,
    AUTO_ROLES: 10,
  },
  ULTRA: {
    CUSTOM_COMMANDS: 200,
    REACTION_ROLES: 100,
    AUTO_ROLES: 50,
  }
};

// Utilities
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / XP_CONSTANTS.BASE_XP));
}

export function calculateXP(level: number): number {
  return Math.floor(XP_CONSTANTS.BASE_XP * Math.pow(level, 2));
}

export function formatTimestamp(date: Date, format: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R' = 'f'): string {
  const unix = Math.floor(date.getTime() / 1000);
  return `<t:${unix}:${format}>`;
}

export function parseVariables(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return result;
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max - 3) + '...' : str;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function chunk<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Permission Helpers
export function hasPermission(permissions: bigint, required: bigint): boolean {
  return (permissions & BOT_PERMISSIONS.ADMINISTRATOR) === BOT_PERMISSIONS.ADMINISTRATOR || (permissions & required) === required;
}

export function hasManageServer(permissions: bigint): boolean {
  return hasPermission(permissions, BOT_PERMISSIONS.MANAGE_GUILD);
}

export const discordSnowflake = {
  getTimestamp(snowflake: string): Date {
    return new Date(Number(BigInt(snowflake) >> 22n) + 1420070400000);
  },
  isValid(snowflake: string): boolean {
    return /^\d{17,19}$/.test(snowflake);
  }
};
