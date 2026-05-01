import type { CSSProperties } from 'react';
import type { BotStatus } from './api/status/route';
import { getSessionUser } from '@/lib/session';
import type { SessionUser } from '@/lib/session';

// ─── i18n ────────────────────────────────────────────────────────────────────

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'Exora シリーズ',
    subtitle: 'BOT ステータス ダッシュボード',
    unit: 'ユニット',
    footer: 'Galileo DB (PostgreSQL) · Redis',
    online: 'オンライン',
    langToggle: 'English',
    langToggleHref: '?lang=en',
    heartbeat: '最終ハートビート',
    never: 'なし',
    login: 'Discord でログイン',
    logout: 'ログアウト',
    loggedInAs: 'ログイン中',
  },
  en: {
    title: 'Exora Series',
    subtitle: 'Bot Status Dashboard',
    unit: 'Unit',
    footer: 'Galileo DB (PostgreSQL) · Redis',
    online: 'online',
    langToggle: '日本語',
    langToggleHref: '?lang=ja',
    heartbeat: 'Last heartbeat',
    never: 'never',
    login: 'Login with Discord',
    logout: 'Logout',
    loggedInAs: 'Logged in as',
  },
} as const;

// ─── Bot metadata ─────────────────────────────────────────────────────────────

const BOT_META: Record<string, { num: number; lang: string; color: string }> = {
  jupiter: { num: 1, lang: 'Java / Discord4J',          color: '#d97706' },
  saturn:  { num: 2, lang: 'TypeScript / discord.js',   color: '#a78bfa' },
  uranus:  { num: 3, lang: 'Rust / Serenity',           color: '#67e8f9' },
  neptune: { num: 4, lang: 'Haskell / discord-haskell', color: '#34d399' },
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const card: CSSProperties = {
  border: '1px solid #30363d',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

// ─── Components ───────────────────────────────────────────────────────────────

function avatarUrl(user: SessionUser): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}

function UserArea({ user, t, lang }: { user: SessionUser | null; t: (typeof T)[Lang]; lang: Lang }) {
  if (!user) {
    return (
      <a
        href="/api/auth/login"
        style={{
          fontSize: '0.82rem',
          background: '#5865F2',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '0.4rem',
          padding: '0.35rem 0.9rem',
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        {t.login}
      </a>
    );
  }
  const displayName = user.global_name ?? user.username;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl(user)}
        alt={displayName}
        width={32}
        height={32}
        style={{ borderRadius: '50%' }}
      />
      <span style={{ fontSize: '0.82rem', color: '#e6edf3' }}>
        {t.loggedInAs}: <strong>{displayName}</strong>
      </span>
      <a
        href={`/api/auth/logout`}
        style={{
          fontSize: '0.75rem',
          color: '#8b949e',
          textDecoration: 'none',
          border: '1px solid #30363d',
          borderRadius: '0.4rem',
          padding: '0.2rem 0.6rem',
          whiteSpace: 'nowrap',
        }}
      >
        {t.logout}
      </a>
    </div>
  );
}

function statusBadge(status: string, t: (typeof T)[Lang]) {
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
      {online ? t.online : status}
    </span>
  );
}

function formatHeartbeat(ts: string | null, t: (typeof T)[Lang]): string {
  if (!ts) return t.never;
  const d = new Date(ts);
  return isNaN(d.getTime()) ? t.never : d.toLocaleString();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];
  const [bots, user] = await Promise.all([getBotStatuses(), getSessionUser()]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        color: '#e6edf3',
        padding: '2.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem' }}>🪐 {t.title}</h1>
          <p style={{ color: '#8b949e', margin: '0 0 2rem' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <UserArea user={user} t={t} lang={lang} />
          <a
            href={t.langToggleHref}
            style={{
              fontSize: '0.8rem',
              color: '#58a6ff',
              textDecoration: 'none',
              border: '1px solid #30363d',
              borderRadius: '0.4rem',
              padding: '0.3rem 0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {t.langToggle}
          </a>
        </div>
      </div>

      {/* Bot cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
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
                {t.unit} {meta.num} · {meta.lang}
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
              {statusBadge(bot.status, t)}
              <p style={{ color: '#484f58', fontSize: '0.68rem', margin: '0.6rem 0 0' }}>
                {t.heartbeat}: {formatHeartbeat(bot.last_heartbeat_at, t)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p style={{ marginTop: '2.5rem', fontSize: '0.72rem', color: '#484f58' }}>
        {t.footer}
      </p>
    </main>
  );
}
