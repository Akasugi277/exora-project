'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BOT_FAVICONS, BOT_KEYS, BOT_META, type BotKey } from '@/lib/bot-meta';

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

type FetchStatus = 'loading' | 'ok' | 'unauthorized' | 'missing_scope' | 'error';
type TabKey = 'all' | BotKey;

interface BotGuildState {
  status: FetchStatus;
  guilds: DiscordGuild[];
}

interface Props {
  lang: 'ja' | 'en';
}

const ADMINISTRATOR = 0x8;

const T = {
  ja: {
    subtitle: 'あなたと各 BOT が共通して参加しているサーバーを表示します。',
    loading: '読み込み中...',
    loginRequired: 'サーバー一覧を表示するにはログインが必要です。',
    reAuthRequired: 'サーバー権限が不足しています。再ログインしてください。',
    reLogin: '再ログイン',
    empty: '共通サーバーはありません。',
    error: '取得に失敗しました。',
    owner: 'オーナー',
    admin: '管理者',
    count: (n: number) => `${n} サーバー`,
    seeAll: '一覧を開く',
    tabAll: 'すべて',
  },
  en: {
    subtitle: 'Servers where you and each bot are both present.',
    loading: 'Loading...',
    loginRequired: 'Please log in to view server list.',
    reAuthRequired: 'Missing guild permission. Please re-login.',
    reLogin: 'Re-login',
    empty: 'No shared servers.',
    error: 'Failed to load.',
    owner: 'Owner',
    admin: 'Admin',
    count: (n: number) => `${n} server${n !== 1 ? 's' : ''}`,
    seeAll: 'Open list',
    tabAll: 'All',
  },
} as const;

function hasAdmin(permissions: string): boolean {
  try {
    return (Number(permissions) & ADMINISTRATOR) !== 0;
  } catch {
    return false;
  }
}

function GuildIcon({ guild }: { guild: DiscordGuild }) {
  if (guild.icon) {
    const ext = guild.icon.startsWith('a_') ? 'gif' : 'png';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=64`}
        alt={guild.name}
        width={28}
        height={28}
        className="rounded-full shrink-0"
      />
    );
  }

  const acronym = guild.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center shrink-0">
      <span className="text-[10px] font-bold text-text-muted">{acronym}</span>
    </div>
  );
}

// ─── "すべて" タブ用: guildId → { guild, bots[] } のマップを構築 ─────────────

interface MergedGuild {
  guild: DiscordGuild;
  bots: BotKey[];
}

function buildMergedGuilds(byBot: Record<BotKey, BotGuildState>): MergedGuild[] {
  const map = new Map<string, MergedGuild>();

  for (const bot of BOT_KEYS) {
    const state = byBot[bot];
    if (state.status !== 'ok') continue;
    for (const guild of state.guilds) {
      const existing = map.get(guild.id);
      if (existing) {
        existing.bots.push(bot);
      } else {
        map.set(guild.id, { guild, bots: [bot] });
      }
    }
  }

  // 複数BOT参加サーバーを上に、次に名前順
  return [...map.values()].sort((a, b) => {
    if (b.bots.length !== a.bots.length) return b.bots.length - a.bots.length;
    return a.guild.name.localeCompare(b.guild.name);
  });
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS: TabKey[] = ['all', ...BOT_KEYS];

function TabBar({
  activeTab,
  onChange,
  lang,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  lang: 'ja' | 'en';
}) {
  const t = T[lang];

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4">
      {TABS.map((tab) => {
        const isActive = tab === activeTab;
        const isAll = tab === 'all';
        const label = isAll
          ? t.tabAll
          : tab.charAt(0).toUpperCase() + tab.slice(1);
        const accentClass = isAll ? '' : BOT_META[tab as BotKey].accentClass;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={[
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors',
              isActive
                ? isAll
                  ? 'bg-border text-text-base'
                  : `bg-border ${accentClass}`
                : 'text-text-muted hover:text-text-base hover:bg-border/50',
            ].join(' ')}
          >
            {!isAll && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={BOT_FAVICONS[tab as BotKey]}
                alt={label}
                width={12}
                height={12}
                className="rounded-sm shrink-0"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

function BotTabPanel({
  bot,
  state,
  lang,
}: {
  bot: BotKey;
  state: BotGuildState;
  lang: 'ja' | 'en';
}) {
  const t = T[lang];
  const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BOT_FAVICONS[bot]}
            alt={`${displayName} runtime`}
            width={16}
            height={16}
            className="rounded-sm shrink-0"
          />
          <p className={`text-sm font-semibold truncate ${BOT_META[bot].accentClass}`}>
            {displayName}
          </p>
        </div>
        <Link
          href={`/bots/${bot}/servers?lang=${lang}`}
          className="text-xs text-accent-blue hover:opacity-80 transition-opacity shrink-0"
        >
          {t.seeAll}
        </Link>
      </div>

      {state.status === 'ok' && state.guilds.length === 0 && (
        <p className="text-xs text-text-muted">{t.empty}</p>
      )}
      {state.status === 'error' && (
        <p className="text-xs text-text-muted">{t.error}</p>
      )}
      {state.status === 'ok' && state.guilds.length > 0 && (
        <ul className="space-y-1.5">
          {state.guilds.map((guild) => {
            const isAdmin = hasAdmin(guild.permissions);
            return (
              <li key={guild.id} className="flex items-center gap-2.5 py-1">
                <GuildIcon guild={guild} />
                <p className="text-xs text-text-base truncate flex-1 min-w-0">{guild.name}</p>
                <div className="flex items-center gap-1 shrink-0">
                  {guild.owner && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {t.owner}
                    </span>
                  )}
                  {!guild.owner && isAdmin && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {t.admin}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SharedServersOverview({ lang }: Props) {
  const t = T[lang];
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const [byBot, setByBot] = useState<Record<BotKey, BotGuildState>>({
    jupiter: { status: 'loading', guilds: [] },
    saturn: { status: 'loading', guilds: [] },
    uranus: { status: 'loading', guilds: [] },
    neptune: { status: 'loading', guilds: [] },
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/guilds/shared', { cache: 'no-store' })
      .then(async (res) => {
        if (cancelled) return;

        const makeAll = (status: FetchStatus): Record<BotKey, BotGuildState> => ({
          jupiter: { status, guilds: [] },
          saturn: { status, guilds: [] },
          uranus: { status, guilds: [] },
          neptune: { status, guilds: [] },
        });

        if (res.status === 401) { setByBot(makeAll('unauthorized')); return; }

        if (res.status === 403) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setByBot(makeAll(body.error === 'missing_scope' ? 'missing_scope' : 'error'));
          return;
        }

        if (!res.ok) { setByBot(makeAll('error')); return; }

        const data = (await res.json()) as {
          bots: Record<BotKey, { status: 'ok' | 'error'; guilds: DiscordGuild[] }>;
        };

        setByBot({
          jupiter: { status: data.bots.jupiter.status === 'ok' ? 'ok' : 'error', guilds: data.bots.jupiter.guilds },
          saturn:  { status: data.bots.saturn.status  === 'ok' ? 'ok' : 'error', guilds: data.bots.saturn.guilds  },
          uranus:  { status: data.bots.uranus.status  === 'ok' ? 'ok' : 'error', guilds: data.bots.uranus.guilds  },
          neptune: { status: data.bots.neptune.status === 'ok' ? 'ok' : 'error', guilds: data.bots.neptune.guilds },
        });
      })
      .catch(() => {
        if (cancelled) return;
        setByBot({
          jupiter: { status: 'error', guilds: [] },
          saturn:  { status: 'error', guilds: [] },
          uranus:  { status: 'error', guilds: [] },
          neptune: { status: 'error', guilds: [] },
        });
      });

    return () => { cancelled = true; };
  }, []);

  const allStates = BOT_KEYS.map((bot) => byBot[bot]?.status ?? 'loading');
  const allLoading       = allStates.every((s) => s === 'loading');
  const allUnauthorized  = allStates.every((s) => s === 'unauthorized');
  const hasMissingScope  = allStates.some((s) => s === 'missing_scope');

  const mergedGuilds = buildMergedGuilds(byBot);
  const totalUnique  = mergedGuilds.length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="rounded-2xl border border-border bg-surface-alt px-5 py-5">
      {/* Header */}
      <div className="mb-3">
        <p className="text-sm text-text-muted">{t.subtitle}</p>
        {!allLoading && !allUnauthorized && !hasMissingScope && (
          <p className="text-xs text-text-muted mt-1">{t.count(totalUnique)}</p>
        )}
      </div>

      {/* Tab bar */}
      {!allLoading && !allUnauthorized && !hasMissingScope && (
        <TabBar activeTab={activeTab} onChange={setActiveTab} lang={lang} />
      )}

      {/* Loading */}
      {allLoading && (
        <div className="flex items-center gap-3 text-sm text-text-muted py-4">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {t.loading}
        </div>
      )}

      {/* Unauthorized */}
      {allUnauthorized && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-text-muted">{t.loginRequired}</p>
          <a
            href="/api/auth/login"
            className="text-xs px-4 py-1.5 rounded-full border border-border hover:bg-border/50 transition-colors text-text-base"
          >
            Login
          </a>
        </div>
      )}

      {/* Missing scope */}
      {!allUnauthorized && hasMissingScope && (
        <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-6 py-8 flex flex-col items-center gap-3 text-center mb-4">
          <p className="text-sm text-text-muted">{t.reAuthRequired}</p>
          <a
            href="/api/auth/logout"
            className="text-xs px-4 py-1.5 rounded-full border border-amber-500/40 hover:bg-amber-500/10 transition-colors text-amber-400"
          >
            {t.reLogin}
          </a>
        </div>
      )}

      {/* ─── Tab: すべて ─────────────────────────────────────────────────── */}
      {!allLoading && !allUnauthorized && activeTab === 'all' && (
        <>
          {mergedGuilds.length === 0 && (
            <p className="text-xs text-text-muted py-2">{t.empty}</p>
          )}
          {mergedGuilds.length > 0 && (
            <ul className="space-y-2">
              {mergedGuilds.map(({ guild, bots }) => {
                const isAdmin = hasAdmin(guild.permissions);
                return (
                  <li
                    key={guild.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <GuildIcon guild={guild} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-base truncate">{guild.name}</p>
                      {/* 参加BOTアイコン */}
                      <div className="flex items-center gap-1 mt-1">
                        {bots.map((b) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={b}
                            src={BOT_FAVICONS[b]}
                            alt={b}
                            width={12}
                            height={12}
                            className="rounded-sm"
                            title={b.charAt(0).toUpperCase() + b.slice(1)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {guild.owner && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {t.owner}
                        </span>
                      )}
                      {!guild.owner && isAdmin && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {t.admin}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {/* ─── Tab: 個別BOT ────────────────────────────────────────────────── */}
      {!allLoading && !allUnauthorized && activeTab !== 'all' && (
        <BotTabPanel
          bot={activeTab as BotKey}
          state={byBot[activeTab as BotKey] ?? { status: 'loading', guilds: [] }}
          lang={lang}
        />
      )}
    </section>
  );
}
