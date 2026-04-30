import 'dotenv/config';
import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { pingCommand, handlePing } from './commands/ping';
import { infoCommand, handleInfo } from './commands/info';
import { upsertBotInstance, startHeartbeat, pool } from './db';

const token = requireEnv('DISCORD_TOKEN_SATURN');

async function main(): Promise<void> {
  // Galileo DB connectivity check
  await pool.query('SELECT 1');
  console.log('[saturn] Galileo DB connected');

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, async (c) => {
    console.log(`[saturn] Online as ${c.user.tag}`);

    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(c.user.id), {
      body: [pingCommand.toJSON(), infoCommand.toJSON()],
    });
    console.log('[saturn] Slash commands registered');

    await upsertBotInstance('saturn', 'TypeScript').catch((e: unknown) =>
      console.error('[saturn] DB heartbeat failed:', e),
    );

    startHeartbeat('saturn');
    console.log('[saturn] Heartbeat started (30 s)');
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
      await handlePing(interaction).catch((e: unknown) =>
        console.error('[saturn] /ping error:', e),
      );
    }
    if (interaction.commandName === 'info') {
      await handleInfo(interaction).catch((e: unknown) =>
        console.error('[saturn] /info error:', e),
      );
    }
  });

  await client.login(token);
}

main().catch((err: unknown) => {
  console.error('[saturn] Fatal:', err);
  process.exit(1);
});

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}
