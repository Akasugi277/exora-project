'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

// ─── i18n ──────────────────────────────────────────────────────────────────

const T = {
  ja: {
    title: '参加サーバー',
    subtitle: 'あなたと BOT が共通して参加しているサーバーの一覧です。',
    loading: '読み込み中...',
    empty: 'このBOTと共通のサーバーが見つかりません。',
    loginRequired: 'サーバー一覧を表示するにはログインが必要です。',
    reAuthRequired: 'サーバー情報へのアクセス権限がありません。一度ログアウトして再度ログインしてください。',
    reLogin: '再ログイン',
    owner: 'オーナー',
    admin: '管理者',
    count: (n: number) => `${n} サーバー`,
    error: '取得に失敗しました。再度お試しください。',
  },
  en: {
    title: 'Shared Servers',
    subtitle: 'Servers where both you and this bot are present.',
    loading: 'Loading...',
    empty: 'No shared servers found with this bot.',
    loginRequired: 'Please log in to view server list.',
    reAuthRequired: 'Missing permission to read your guilds. Please log out and log in again.',
    reLogin: 'Re-login',
    owner: 'Owner',
    admin: 'Admin',
    count: (n: number) => `${n} server${n !== 1 ? 's' : ''}`,
    error: 'Failed to load. Please try again.',
  },
} as const;

// ─── Guild icon ─────────────────────────────────────────────────────────────

function GuildIcon({ guild }: { guild: Guild }) {
  if (guild.icon) {
    const ext = guild.icon.startsWith('a_') ? 'gif' : 'png';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=64`}
        alt={guild.name}
        width={40}
        height={40}
        className="rounded-full shrink-0"
      />
    );
  }

  // Default avatar: acronym
  const acronym = guild.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-text-muted">{acronym}</span>
    </div>
  );
}

// ─── Permission helpers ─────────────────────────────────────────────────────

const ADMINISTRATOR = BigInt(0x8);

function hasAdmin(permissions: string): boolean {
  try {
    return (BigInt(permissions) & ADMINISTRATOR) === ADMINISTRATOR;
  } catch {
    return false;
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  bot: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
}

export default function ServersClient({ bot, accentClass, borderClass, bgClass }: Props) {
  const searchParams = useSearchParams();
  const lang: 'ja' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'ja';
  const t = T[lang];

  const [guilds, setGuilds] = useState<Guild[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'unauthorized' | 'missing_scope' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setGuilds(null);

    fetch(`/api/bots/${bot}/guilds`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) { setStatus('unauthorized'); return; }
        if (res.status === 403) {
          const body = await res.json().catch(() => ({})) as { error?: string };
          if (body.error === 'missing_scope') { setStatus('missing_scope'); return; }
          setStatus('unauthorized');
          return;
        }
        if (!res.ok) { setStatus('error'); return; }
        const data = (await res.json()) as { guilds: Guild[] };
        setGuilds(data.guilds);
        setStatus('ok');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [bot]);

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className={`rounded-2xl border ${borderClass} ${bgClass} px-7 py-5 mb-8`}>
        <h2 className={`text-xl font-bold mb-1 ${accentClass}`}>{t.title}</h2>
        <p className="text-sm text-text-muted">{t.subtitle}</p>
        {status === 'ok' && guilds && (
          <p className="text-xs text-text-muted mt-2">{t.count(guilds.length)}</p>
        )}
      </div>

      {/* States */}
      {status === 'loading' && (
        <div className="flex items-center gap-3 text-sm text-text-muted py-10 justify-center">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {t.loading}
        </div>
      )}

      {status === 'unauthorized' && (
        <div className="rounded-xl border border-dashed border-border bg-surface-alt/50 px-6 py-10 flex flex-col items-center gap-3 text-center">
          <svg className="w-8 h-8 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-text-muted">{t.loginRequired}</p>
          <a
            href="/api/auth/login"
            className="text-xs px-4 py-1.5 rounded-full border border-border hover:bg-border/50 transition-colors text-text-base"
          >
            Login
          </a>
        </div>
      )}

      {status === 'missing_scope' && (
        <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-6 py-10 flex flex-col items-center gap-3 text-center">
          <svg className="w-8 h-8 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-text-muted max-w-xs">{t.reAuthRequired}</p>
          <a
            href="/api/auth/logout"
            className="text-xs px-4 py-1.5 rounded-full border border-amber-500/40 hover:bg-amber-500/10 transition-colors text-amber-400"
          >
            {t.reLogin}
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-dashed border-border bg-surface-alt/50 px-6 py-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-text-muted">{t.error}</p>
        </div>
      )}

      {status === 'ok' && guilds && guilds.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface-alt/50 px-6 py-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-text-muted">{t.empty}</p>
        </div>
      )}

      {/* Guild list */}
      {status === 'ok' && guilds && guilds.length > 0 && (
        <ul className="space-y-2">
          {guilds.map((guild) => {
            const isAdmin = hasAdmin(guild.permissions);
            return (
              <li
                key={guild.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface-alt px-5 py-3 hover:bg-border/30 transition-colors"
              >
                <GuildIcon guild={guild} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-base truncate">{guild.name}</p>
                  <p className="text-xs text-text-muted">ID: {guild.id}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {guild.owner && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {t.owner}
                    </span>
                  )}
                  {!guild.owner && isAdmin && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
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
