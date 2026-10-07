import 'dotenv/config';
import { ChiroClient } from './client';
import { logger } from './utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const client = new ChiroClient();

// Global Error Handlers
process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
});

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFolders = fs.readdirSync(commandsPath);
  for (const folder of commandFolders) {
    const commandsFolder = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsFolder, file);
      const command = require(filePath).default || require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath).default || require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down...');
  client.destroy();
  client.redis.quit();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

client.login(process.env.DISCORD_TOKEN).catch(err => {
  logger.error(err, 'Failed to login');
});
