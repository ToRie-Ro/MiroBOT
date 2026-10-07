import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { logger } from './utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const commands = [];
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
        commands.push(command.data.toJSON());
      } else {
        logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    ) as any[];

    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error(error);
  }
})();
