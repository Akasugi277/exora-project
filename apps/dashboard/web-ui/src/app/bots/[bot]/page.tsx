import { notFound } from 'next/navigation';
import type { BotStatus } from '@/app/api/status/route';
import ComingSoon from '@/components/ComingSoon';

// ─── Bot metadata ─────────────────────────────────────────────────────────────

type BotKey = 'jupiter' | 'saturn' | 'uranus' | 'neptune';

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
    heartbeat: '最終ハートビート',
    never: 'なし',
    serversTitle: '導入サーバー一覧',
    serversDesc: 'このBOTが導入されているDiscordサーバーの一覧を表示予定です。',
    settingsTitle: '機能設定',
    settingsDesc: 'サーバー・チャンネルごとの機能のON/OFFや詳細設定を管理予定です。',
  },
  en: {
    unit: 'Unit',
    status: 'Status',
    online: 'Online',
    heartbeat: 'Last heartbeat',
    never: 'never',
    serversTitle: 'Installed Servers',
    serversDesc: 'A list of Discord servers where this bot is installed will be shown here.',
    settingsTitle: 'Feature Settings',
    settingsDesc: 'Per-server and per-channel feature configuration will be managed here.',
  },
} as const;

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getBotStatus(botName: string): Promise<BotStatus | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/status`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { bots: BotStatus[] };
    return data.bots.find((b) => b.bot_name === botName) ?? null;
  } catch {
    return null;
  }
}

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
  const lang = langParam === 'en' ? 'en' : 'ja';
  const t = T[lang];
  const botStatus = await getBotStatus(bot);
  const status = botStatus?.status ?? 'unknown';
  const online = status === 'online';
  const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Bot header */}
      <div className={`rounded-2xl border ${meta.borderClass} ${meta.bgClass} px-7 py-6 mb-8`}>
        <p className="text-xs text-text-muted mb-1">{t.unit} #{meta.num}</p>
        <h1 className={`text-3xl font-bold mb-1 ${meta.accentClass}`}>{displayName}</h1>
        <p className="text-sm text-text-muted">{meta.language}</p>

        {/* Status row */}
        <div className="flex items-center gap-6 mt-5">
          <div>
            <p className="text-[11px] text-text-muted mb-1">{t.status}</p>
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${
              online ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {online ? t.online : status}
            </span>
          </div>
          <div>
            <p className="text-[11px] text-text-muted mb-1">{t.heartbeat}</p>
            <p className="text-sm font-mono text-text-base">
              {botStatus?.last_heartbeat_at
                ? new Date(botStatus.last_heartbeat_at).toLocaleString('ja-JP')
                : t.never}
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon sections */}
      <ComingSoon title={t.serversTitle} description={t.serversDesc} />
      <ComingSoon title={t.settingsTitle} description={t.settingsDesc} />
    </div>
  );
}
