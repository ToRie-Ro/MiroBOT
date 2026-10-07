import { Events, VoiceState } from 'discord.js';
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
} as Event;