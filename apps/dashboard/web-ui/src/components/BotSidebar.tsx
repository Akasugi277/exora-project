'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BOT_FAVICONS, BOT_META, type BotKey } from '@/lib/bot-meta';

interface SidebarUser {
  username: string;
  globalName: string | null;
  avatarUrl: string;
}

interface Props {
  bot: BotKey;
  user: SidebarUser | null;
}

const T = {
  ja: {
    backToMain: 'Exora メインへ',
    overview: 'ダッシュボード',
    leaderboard: 'リーダーボード',
    servers: '参加サーバー',
    settings: 'サーバー設定',
    logout: 'ログアウト',
    loggedInAs: 'ログイン中',
    langHref: '?lang=en',
    langLabel: 'English',
    unit: 'ユニット',
  },
  en: {
    backToMain: 'Back to Exora',
    overview: 'Dashboard',
    leaderboard: 'Leaderboard',
    servers: 'Shared Servers',
    settings: 'Server Settings',
    logout: 'Log out',
    loggedInAs: 'Logged in as',
    langHref: '?lang=ja',
    langLabel: '日本語',
    unit: 'Unit',
  },
} as const;

export default function BotSidebar({ bot, user }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang: 'ja' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'ja';
  const t = T[lang];

  const meta = BOT_META[bot];
  const favicon = BOT_FAVICONS[bot];
  const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);

  function langHref() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang === 'ja' ? 'en' : 'ja');
    return `${pathname}?${params.toString()}`;
  }

  function isActive(href: string) {
    // exact match for overview, prefix match for sub-pages
    if (href === `/bots/${bot}`) return pathname === href;
    return pathname.startsWith(href);
  }

  const NAV = [
    {
      href: `/bots/${bot}`,
      label: t.overview,
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      href: `/bots/${bot}/leaderboard`,
      label: t.leaderboard,
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      href: `/bots/${bot}/servers`,
      label: t.servers,
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4.978 4.978 0 00-1.022-3.021A3 3 0 0119 17v1h-3zM4.022 13.979A4.978 4.978 0 003 17v1H0v-1a3 3 0 013.022-3.021z" />
        </svg>
      ),
    },
    {
      href: `/bots/${bot}/settings`,
      label: t.settings,
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ] as const;

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-surface-alt border-r border-border flex flex-col z-30">
      {/* Back to main + BOT identity */}
      <div className="px-5 py-5 border-b border-border space-y-3">
        {/* Back link */}
        <Link
          href={`/?lang=${lang}`}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-base transition-colors group"
        >
          <svg className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="flex items-center gap-1">
            <span className="text-base leading-none">🪐</span>
            {t.backToMain}
          </span>
        </Link>

        {/* BOT identity */}
        <div className={`rounded-xl border ${meta.borderClass} ${meta.bgClass} px-3 py-2.5`}>
          <p className="text-[10px] text-text-muted mb-0.5">{t.unit} #{meta.num}</p>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={favicon} alt={`${displayName} icon`} width={18} height={18} className="rounded-sm shrink-0" />
            <span className={`text-base font-bold ${meta.accentClass}`}>{displayName}</span>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">{meta.language}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`${item.href}?lang=${lang}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? `bg-border/60 ${meta.accentClass}`
                  : 'text-text-muted hover:text-text-base hover:bg-border/40'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3 space-y-2">
        {/* Lang toggle */}
        <Link
          href={langHref()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-base hover:bg-border/40 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-3.754 1 1 0 111.94-.482c.26 1.04.698 2.01 1.268 2.893.484-.894.847-1.884 1.068-2.911H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
          </svg>
          {t.langLabel}
        </Link>

        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatarUrl} alt={user.globalName ?? user.username} width={28} height={28} className="rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-base truncate">{user.globalName ?? user.username}</p>
              <p className="text-[10px] text-text-muted">{t.loggedInAs}</p>
            </div>
            <a href="/api/auth/logout" title={t.logout} className="text-text-muted hover:text-red-400 transition-colors shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ) : (
          <a
            href="/api/auth/login"
            className="flex items-center justify-center gap-2 mx-1 py-2 rounded-lg text-xs font-semibold bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.024.016.046.034.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Login
          </a>
        )}
      </div>
    </aside>
  );
}
