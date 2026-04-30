import 'dotenv/config';
import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { pingCommand, handlePing } from './commands/ping';

const token = requireEnv('DISCORD_TOKEN_SATURN');
const dbUrl  = requireEnv('DATABASE_URL');
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

async function checkDb(): Promise<void> {
  const pool = new Pool({ connectionString: dbUrl });
  await pool.query('SELECT 1');
  await pool.end();
  console.log('[saturn] Galileo DB connected');
}

async function checkRedis(): Promise<void> {
  const redis = new Redis(redisUrl);
  await redis.ping();
  await redis.quit();
  console.log('[saturn] Redis connected');
}

async function main(): Promise<void> {
  await checkDb();
  await checkRedis();

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, async (c) => {
    console.log(`[saturn] Online as ${c.user.tag}`);
    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(c.user.id), {
      body: [pingCommand.toJSON()],
    });
    console.log('[saturn] Slash commands registered');
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
      await handlePing(interaction);
    }
  });

  await client.login(token);
}

main().catch((err: unknown) => {
  console.error('[saturn] Fatal error:', err);
  process.exit(1);
});

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}
