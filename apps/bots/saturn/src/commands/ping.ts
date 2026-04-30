import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Pong! Verify that Saturn is online.');

export async function handlePing(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  await interaction.reply('\uD83E\uFA90 Pong! **Saturn** (TypeScript / discord.js) is online.');
}
