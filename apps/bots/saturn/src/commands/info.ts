import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logCommand } from '../db';

export const infoCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Show Saturn bot information and uptime.');

const START_TIME = Date.now();

export async function handleInfo(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const start = Date.now();
  const uptimeMs = Date.now() - START_TIME;
  const hours   = Math.floor(uptimeMs / 3_600_000);
  const minutes = Math.floor((uptimeMs % 3_600_000) / 60_000);
  const seconds = Math.floor((uptimeMs % 60_000) / 1_000);
  const uptime  = `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  await interaction.reply(
    `\uD83E\uDE90 **Saturn** — Bot Information\n` +
    `• Language  : TypeScript / discord.js v14\n` +
    `• Version   : 0.1.0\n` +
    `• Uptime    : ${uptime}`,
  );
  await logCommand({
    botName: 'saturn',
    guildId: interaction.guildId,
    userId: interaction.user.id,
    commandName: 'info',
    status: 'ok',
    latencyMs: Date.now() - start,
  }).catch(() => {});
}
