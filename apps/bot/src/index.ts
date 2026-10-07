import 'dotenv/config';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { ChiroClient } from './client';
import { logger } from './utils/logger';

const client = new ChiroClient();

// ── Global error handlers ──────────────────────────────────────────────────
process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
});

// ── Load commands ──────────────────────────────────────────────────────────
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFolders = fs.readdirSync(commandsPath);
  for (const folder of commandFolders) {
    const commandsFolder = path.join(commandsPath, folder);
    if (!fs.statSync(commandsFolder).isDirectory()) continue;
    const commandFiles = fs
      .readdirSync(commandsFolder)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsFolder, file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command = require(filePath).default ?? require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        logger.warn(
          `Command at ${filePath} is missing "data" or "execute" property.`,
        );
      }
    }
  }
}

// ── Load events ────────────────────────────────────────────────────────────
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath).default ?? require(filePath);
    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(...args, client),
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(...args, client),
      );
    }
  }
}

// ── Graceful shutdown ──────────────────────────────────────────────────────
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  client.destroy();
  await client.redis.quit();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ── Health-check HTTP server (Render free-tier keep-alive) ─────────────────
const port = Number(process.env.PORT ?? 8080);
http
  .createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  })
  .listen(port, () => {
    logger.info(`Health-check server listening on port ${port}`);
  });

// ── Connect with auto-retry ───────────────────────────────────────────────
async function connectToDiscord() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    logger.warn('DISCORD_TOKEN is not configured in environment variables. Waiting 20s before checking again...');
    setTimeout(connectToDiscord, 20000);
    return;
  }

  try {
    logger.info('Attempting to connect to Discord Gateway...');
    await client.login(token);
    logger.info('Successfully authenticated and connected to Discord!');
  } catch (err: any) {
    logger.error(err, 'Failed to login to Discord. Please verify DISCORD_TOKEN and Privileged Gateway Intents (Message Content, Server Members) in Discord Developer Portal.');
    setTimeout(connectToDiscord, 30000);
  }
}

connectToDiscord();
