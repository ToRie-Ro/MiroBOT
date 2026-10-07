import { Events, Interaction } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

const interactionCreateEvent: Event = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: ChiroClient) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        client.logger.warn(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        client.logger.error(error, `Error executing ${interaction.commandName}`);
        const errorContent = { content: 'There was an error while executing this command!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorContent);
        } else {
          await interaction.reply(errorContent);
        }
      }
    } else if (interaction.isButton()) {
      // Handle button interactions
      client.logger.info(`Button interaction: ${interaction.customId}`);
    } else if (interaction.isStringSelectMenu()) {
      // Handle select menu interactions
      client.logger.info(`Select menu interaction: ${interaction.customId}`);
    }
  },
};

export default interactionCreateEvent;
