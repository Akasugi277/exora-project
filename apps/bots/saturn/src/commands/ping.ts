import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logCommand } from '../db';

export const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Pong! Verify that Saturn is online.');

export async function handlePing(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const start = Date.now();
  await interaction.reply(
    '\uD83E\uFA90 Pong! **Saturn** (TypeScript / discord.js) is online.',
  );
  await logCommand({
    botName: 'saturn',
    guildId: interaction.guildId,
    userId: interaction.user.id,
    commandName: 'ping',
    status: 'ok',
    latencyMs: Date.now() - start,
  }).catch(() => {});
}
