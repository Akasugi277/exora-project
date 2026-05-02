import { notFound } from 'next/navigation';
import ComingSoon from '@/components/ComingSoon';
import HeartbeatChart from '@/components/HeartbeatChart';
import BotStatusHeader from '@/components/BotStatusHeader';

// ─── Bot metadata ─────────────────────────────────────────────────────────────

type BotKey = 'jupiter' | 'saturn' | 'uranus' | 'neptune';

const BOT_FAVICONS: Record<BotKey, string> = {
  jupiter: 'https://www.google.com/s2/favicons?domain=discord4j.com&sz=64',
  saturn: 'https://www.google.com/s2/favicons?domain=discord.js.org&sz=64',
  uranus: 'https://www.google.com/s2/favicons?domain=rust-lang.org&sz=64',
  neptune: 'https://www.google.com/s2/favicons?domain=www.haskell.org&sz=64',
};

const BOT_META: Record<BotKey, { num: number; language: string; color: string; accentClass: string; bgClass: string; borderClass: string }> = {
  jupiter: {
    num: 1,
    language: 'Java 21 / Discord4J 3.2.6',
    color: '#d97706',
    accentClass: 'text-jupiter',
    bgClass: 'bg-jupiter/10',
    borderClass: 'border-jupiter/40',
  },
  saturn: {
    num: 2,
    language: 'TypeScript / discord.js v14',
    color: '#a78bfa',
    accentClass: 'text-saturn',
    bgClass: 'bg-saturn/10',
    borderClass: 'border-saturn/40',
  },
  uranus: {
    num: 3,
    language: 'Rust / Serenity 0.12',
    color: '#67e8f9',
    accentClass: 'text-uranus',
    bgClass: 'bg-uranus/10',
    borderClass: 'border-uranus/40',
  },
  neptune: {
    num: 4,
    language: 'Haskell / discord-haskell 1.18',
    color: '#34d399',
    accentClass: 'text-neptune',
    bgClass: 'bg-neptune/10',
    borderClass: 'border-neptune/40',
  },
};

// ─── i18n ────────────────────────────────────────────────────────────────────

const T = {
  ja: {
    unit: 'ユニット',
    status: '稼働状態',
    online: 'オンライン',
    offlineUnknown: 'オフライン（unknown）',
    measuring: '計測中...',
    heartbeat: '最終ハートビート',
    never: 'なし',
    heartbeatChart: 'ハートビート履歴',
    serversTitle: '導入サーバー一覧',
    serversDesc: 'このBOTが導入されているDiscordサーバーの一覧を表示予定です。',
    settingsTitle: '機能設定',
    settingsDesc: 'サーバー・チャンネルごとの機能のON/OFFや詳細設定を管理予定です。',
  },
  en: {
    unit: 'Unit',
    status: 'Status',
    online: 'Online',
    offlineUnknown: 'Offline (unknown)',
    measuring: 'Measuring...',
    heartbeat: 'Last heartbeat',
    never: 'never',
    heartbeatChart: 'Heartbeat History',
    serversTitle: 'Installed Servers',
    serversDesc: 'A list of Discord servers where this bot is installed will be shown here.',
    settingsTitle: 'Feature Settings',
    settingsDesc: 'Per-server and per-channel feature configuration will be managed here.',
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

  if (!Object.keys(BOT_META).includes(bot)) {
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
            offlineUnknown: t.offlineUnknown,
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

      {/* Coming Soon sections */}
      <ComingSoon title={t.serversTitle} description={t.serversDesc} />
      <ComingSoon title={t.settingsTitle} description={t.settingsDesc} />
    </div>
  );
}
