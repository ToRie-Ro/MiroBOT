import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { logger } from './utils/logger';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
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
        commands.push(command.data.toJSON());
      } else {
        logger.warn(
          `Command at ${filePath} is missing "data" or "execute" property.`,
        );
      }
    }
  }
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  logger.error('DISCORD_TOKEN and DISCORD_CLIENT_ID must be set.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    logger.info(`Registering ${commands.length} slash command(s)...`);
    const data = (await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    })) as unknown[];
    logger.info(`Successfully registered ${data.length} slash command(s).`);
  } catch (error) {
    logger.error(error, 'Failed to register commands');
    process.exit(1);
  }
})();
