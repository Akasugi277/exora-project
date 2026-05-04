'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BOT_FAVICONS, BOT_KEYS, type BotKey } from '@/lib/bot-meta';

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

type FetchStatus = 'loading' | 'ok' | 'unauthorized' | 'missing_scope' | 'error';

interface BotGuildState {
  status: FetchStatus;
  guilds: DiscordGuild[];
}

interface Props {
  lang: 'ja' | 'en';
}

const ADMINISTRATOR = BigInt(0x8);

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
  },
} as const;

function hasAdmin(permissions: string): boolean {
  try {
    return (BigInt(permissions) & ADMINISTRATOR) === ADMINISTRATOR;
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

export default function SharedServersOverview({ lang }: Props) {
  const t = T[lang];

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

        if (res.status === 401) {
          setByBot({
            jupiter: { status: 'unauthorized', guilds: [] },
            saturn: { status: 'unauthorized', guilds: [] },
            uranus: { status: 'unauthorized', guilds: [] },
            neptune: { status: 'unauthorized', guilds: [] },
          });
          return;
        }

        if (res.status === 403) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          if (body.error === 'missing_scope') {
            setByBot({
              jupiter: { status: 'missing_scope', guilds: [] },
              saturn: { status: 'missing_scope', guilds: [] },
              uranus: { status: 'missing_scope', guilds: [] },
              neptune: { status: 'missing_scope', guilds: [] },
            });
            return;
          }
          setByBot({
            jupiter: { status: 'error', guilds: [] },
            saturn: { status: 'error', guilds: [] },
            uranus: { status: 'error', guilds: [] },
            neptune: { status: 'error', guilds: [] },
          });
          return;
        }

        if (!res.ok) {
          setByBot({
            jupiter: { status: 'error', guilds: [] },
            saturn: { status: 'error', guilds: [] },
            uranus: { status: 'error', guilds: [] },
            neptune: { status: 'error', guilds: [] },
          });
          return;
        }

        const data = (await res.json()) as {
          bots: Record<BotKey, { status: 'ok' | 'error'; guilds: DiscordGuild[] }>;
        };

        const next: Record<BotKey, BotGuildState> = {
          jupiter: { status: data.bots.jupiter.status === 'ok' ? 'ok' : 'error', guilds: data.bots.jupiter.guilds },
          saturn: { status: data.bots.saturn.status === 'ok' ? 'ok' : 'error', guilds: data.bots.saturn.guilds },
          uranus: { status: data.bots.uranus.status === 'ok' ? 'ok' : 'error', guilds: data.bots.uranus.guilds },
          neptune: { status: data.bots.neptune.status === 'ok' ? 'ok' : 'error', guilds: data.bots.neptune.guilds },
        };
        setByBot(next);
      })
      .catch(() => {
        if (cancelled) return;
        setByBot({
          jupiter: { status: 'error', guilds: [] },
          saturn: { status: 'error', guilds: [] },
          uranus: { status: 'error', guilds: [] },
          neptune: { status: 'error', guilds: [] },
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allStates = BOT_KEYS.map((bot) => byBot[bot]?.status ?? 'loading');
  const allLoading = allStates.every((s) => s === 'loading');
  const allUnauthorized = allStates.every((s) => s === 'unauthorized');
  const hasMissingScope = allStates.some((s) => s === 'missing_scope');

  const totalGuilds = BOT_KEYS.reduce((sum, bot) => {
    if (byBot[bot]?.status !== 'ok') return sum;
    return sum + byBot[bot].guilds.length;
  }, 0);

  return (
    <section className="rounded-2xl border border-border bg-surface-alt px-5 py-5">
      <div className="mb-4">
        <p className="text-sm text-text-muted">{t.subtitle}</p>
        {!allLoading && !allUnauthorized && !hasMissingScope && (
          <p className="text-xs text-text-muted mt-2">{t.count(totalGuilds)}</p>
        )}
      </div>

      {allLoading && (
        <div className="flex items-center gap-3 text-sm text-text-muted py-4">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {t.loading}
        </div>
      )}

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

      {!allLoading && !allUnauthorized && (
        <div className="space-y-3">
          {BOT_KEYS.map((bot) => {
            const state = byBot[bot] ?? { status: 'loading', guilds: [] };
            const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);

            return (
              <div key={bot} className="rounded-xl border border-border bg-surface px-4 py-3">
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
                    <p className="text-sm font-semibold text-text-base truncate">{displayName}</p>
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
          })}
        </div>
      )}
    </section>
  );
}
