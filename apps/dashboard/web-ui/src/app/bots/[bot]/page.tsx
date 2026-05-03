import { notFound } from 'next/navigation';
import HeartbeatChart from '@/components/HeartbeatChart';
import BotStatusHeader from '@/components/BotStatusHeader';
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
      </div>

      {/* Heartbeat chart */}
      <div className="mb-6">
        <HeartbeatChart
          botName={bot}
          accentColor={meta.color}
          lang={lang}
        />
      </div>

    </div>
  );
}
