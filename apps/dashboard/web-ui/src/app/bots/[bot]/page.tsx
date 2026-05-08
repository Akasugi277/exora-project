import { notFound } from 'next/navigation';
import HeartbeatChart from '@/components/HeartbeatChart';
import BotStatusHeader from '@/components/BotStatusHeader';
import ServersClient from '@/components/ServersClient';
import { isBotKey, BOT_META, BOT_FAVICONS } from '@/lib/bot-meta';
import type { BotKey } from '@/lib/bot-meta';

// ─── i18n ────────────────────────────────────────────────────────────────────

const T = {
  ja: {
    unit: 'ユニット',
    status: '稼働状態',
    online: 'オンライン',
    offline: 'オフライン',
    measuring: '計測中...',
    heartbeat: '最終ハートビート',
    never: 'なし',
    heartbeatChart: 'ハートビート履歴',
    serverList: 'サーバー一覧',
    invite: 'サーバーに招待',
  },
  en: {
    unit: 'Unit',
    status: 'Status',
    online: 'Online',
    offline: 'Offline',
    measuring: 'Measuring...',
    heartbeat: 'Last heartbeat',
    never: 'never',
    heartbeatChart: 'Heartbeat History',
    serverList: 'Server List',
    invite: 'Add to Server',
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BotPage({
  params,
  searchParams,
}: {
  params: Promise<{ bot: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { bot } = await params;
  const { lang: langParam } = await searchParams;

  if (!isBotKey(bot)) {
    notFound();
  }

  const meta = BOT_META[bot as BotKey];
  const favicon = BOT_FAVICONS[bot as BotKey];
  const lang = langParam === 'en' ? 'en' : 'ja';
  const t = T[lang];
  const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Bot header */}
      <div className={`rounded-2xl border ${meta.borderClass} ${meta.bgClass} px-7 py-6 mb-8`}>
        <p className="text-xs text-text-muted mb-1">{t.unit} #{meta.num}</p>
        <h1 className={`text-3xl font-bold mb-1 ${meta.accentClass}`}>{displayName}</h1>
        <p className="text-sm text-text-muted flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={favicon}
            alt={`${displayName} runtime`}
            width={16}
            height={16}
            className="rounded-sm shrink-0"
          />
          <span>{meta.language}</span>
        </p>

        {/* Live status row — client-side polling, shows "measuring" on load */}
        <BotStatusHeader
          botName={bot}
          lang={lang}
          labels={{
            status: t.status,
            online: t.online,
            offline: t.offline,
            measuring: t.measuring,
            heartbeat: t.heartbeat,
            never: t.never,
          }}
        />

        {/* Invite button */}
        <div className="mt-5">
          <a
            href={meta.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg border ${meta.borderClass} ${meta.bgClass} px-4 py-2 text-sm font-semibold ${meta.accentClass} hover:opacity-80 transition-opacity`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {t.invite}
          </a>
        </div>
      </div>

      {/* Heartbeat chart */}
      <div className="mb-6">
        <HeartbeatChart
          botName={bot}
          accentColor={meta.color}
          lang={lang}
        />
      </div>

      {/* Shared servers */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-base mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-blue shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4.978 4.978 0 00-1.022-3.021A3 3 0 0119 17v1h-3zM4.022 13.979A4.978 4.978 0 003 17v1H0v-1a3 3 0 013.022-3.021z" />
          </svg>
          {t.serverList}
        </h2>
        <ServersClient
          bot={bot}
          accentClass={meta.accentClass}
          borderClass={meta.borderClass}
          bgClass={meta.bgClass}
          embedded
        />
      </div>

    </div>
  );
}
