import type { BotStatus } from './api/status/route';

const BOT_META: Record<
  string,
  { num: number; lang: string; color: string }
> = {
  jupiter: { num: 1, lang: 'Java / Discord4J',           color: '#d97706' },
  saturn:  { num: 2, lang: 'TypeScript / discord.js',    color: '#a78bfa' },
  uranus:  { num: 3, lang: 'Rust / Serenity',            color: '#67e8f9' },
  neptune: { num: 4, lang: 'Haskell / discord-haskell',  color: '#34d399' },
};

const FALLBACK: BotStatus[] = Object.entries(BOT_META).map(([name]) => ({
  bot_name: name,
  language: BOT_META[name].lang,
  status: 'unknown',
  last_heartbeat_at: null,
}));

async function getBotStatuses(): Promise<BotStatus[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/status`,
      { cache: 'no-store' },
    );
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as { bots: BotStatus[] };
    return data.bots.length > 0 ? data.bots : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

const card: React.CSSProperties = {
  border: '1px solid #30363d',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

function statusBadge(status: string) {
  const online = status === 'online';
  return (
    <span
      style={{
        fontSize: '0.7rem',
        background: online ? '#1a4731' : '#2d1e1e',
        color: online ? '#3fb950' : '#f85149',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
      }}
    >
      {online ? 'online' : status}
    </span>
  );
}

export default async function HomePage() {
  const bots = await getBotStatuses();

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        color: '#e6edf3',
        padding: '2.5rem',
      }}
    >
      <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem' }}>🪐 Exora Series</h1>
      <p style={{ color: '#8b949e', margin: '0 0 2rem' }}>
        Bot Status Dashboard
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
        {bots.map((bot) => {
          const meta = BOT_META[bot.bot_name] ?? {
            num: 0,
            lang: bot.language,
            color: '#8b949e',
          };
          return (
            <div key={bot.bot_name} style={card}>
              <p style={{ color: '#8b949e', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>
                Unit {meta.num} · {meta.lang}
              </p>
              <h2
                style={{
                  margin: '0 0 0.75rem',
                  fontSize: '1.2rem',
                  color: meta.color,
                  textTransform: 'capitalize',
                }}
              >
                {bot.bot_name}
              </h2>
              {statusBadge(bot.status)}
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: '2.5rem', fontSize: '0.72rem', color: '#484f58' }}>
        Galileo DB (PostgreSQL) · Redis
      </p>
    </main>
  );
}
