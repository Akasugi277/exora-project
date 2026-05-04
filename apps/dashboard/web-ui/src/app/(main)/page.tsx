import type { BotStatus } from '@/app/api/status/route';
import BotStatusGrid from '@/components/BotStatusGrid';
import ComingSoon from '@/components/ComingSoon';
import AnnouncementList from '@/components/AnnouncementList';
import SharedServersOverview from '@/components/SharedServersOverview';
import { ANNOUNCEMENTS } from '@/data/announcements';

// ─── i18n ────────────────────────────────────────────────────────────────────

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'ダッシュボード',
    subtitle: '全 BOT の稼働状況をリアルタイムで確認できます。',
    announcementSection: 'お知らせ',
    statusSection: 'BOT 稼働状態',
    serversSection: 'サーバー一覧',
    leaderboardTitle: 'ユーザーリーダーボード',
    leaderboardDesc: '各 BOT に紐づけられたユーザーのランキングを表示予定です。',
    unit: 'ユニット',
    online: 'オンライン',
    offline: 'オフライン',
    measuring: '計測中...',
    heartbeat: '最終ハートビート',
    never: 'なし',
    footer: 'Galileo DB (PostgreSQL 16) · Redis 7',
    login: 'Discord でログイン',
    logout: 'ログアウト',
    loggedInAs: 'ログイン中',
    langToggle: 'English',
    langToggleHref: '?lang=en',
  },
  en: {
    title: 'Dashboard',
    subtitle: 'Monitor all bots in real time.',
    announcementSection: 'Announcements',
    statusSection: 'Bot Status',
    serversSection: 'Server List',
    leaderboardTitle: 'User Leaderboard',
    leaderboardDesc: 'Per-bot user rankings will be shown here.',
    unit: 'Unit',
    online: 'online',
    offline: 'offline',
    measuring: 'Measuring...',
    heartbeat: 'Last heartbeat',
    never: 'never',
    footer: 'Galileo DB (PostgreSQL 16) · Redis 7',
    login: 'Login with Discord',
    logout: 'Log out',
    loggedInAs: 'Logged in as',
    langToggle: '日本語',
    langToggleHref: '?lang=ja',
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
  status: 'offline',
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];
  const bots = await getBotStatuses();

  return (
    <div className="px-8 py-8 max-w-5xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-base">{t.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.subtitle}</p>
      </div>

      {/* Announcements section */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-text-base mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-blue shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          {t.announcementSection}
        </h2>
        <AnnouncementList announcements={ANNOUNCEMENTS} lang={lang} />
      </section>

      {/* BOT Status section */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-text-base mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {t.statusSection}
        </h2>
        <BotStatusGrid
          initialBots={bots}
          lang={lang}
          labels={{ online: t.online, offline: t.offline, measuring: t.measuring, heartbeat: t.heartbeat, never: t.never, unit: t.unit }}
        />
      </section>

      {/* Shared servers section */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-text-base mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-blue shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4.978 4.978 0 00-1.022-3.021A3 3 0 0119 17v1h-3zM4.022 13.979A4.978 4.978 0 003 17v1H0v-1a3 3 0 013.022-3.021z" />
          </svg>
          {t.serversSection}
        </h2>
        <SharedServersOverview lang={lang} />
      </section>

      {/* Coming Soon sections */}
      <div className="space-y-6">
        <ComingSoon title={t.leaderboardTitle} description={t.leaderboardDesc} />
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-text-muted">{t.footer}</p>
    </div>
  );
}
