import { Events, GuildMember } from 'discord.js';
import { ChiroClient } from '../client';
import { Event } from '../types';

export default {
  name: Events.GuildMemberUpdate,
  async execute(oldMember: GuildMember, newMember: GuildMember, client: ChiroClient) {
    // Handle role or nickname changes logging
  }
} as Event;