'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface SidebarUser {
  username: string;
  globalName: string | null;
  avatarUrl: string;
}

interface SidebarProps {
  user: SidebarUser | null;
}

const BOT_LINKS = [
  {
    href: '/bots/jupiter',
    label: 'Jupiter',
    color: 'text-jupiter',
    dot: 'bg-jupiter',
    desc: 'Java / Discord4J',
    favicon: 'https://www.google.com/s2/favicons?domain=discord4j.com&sz=128',
  },
  {
    href: '/bots/saturn',
    label: 'Saturn',
    color: 'text-saturn',
    dot: 'bg-saturn',
    desc: 'TypeScript / discord.js',
    favicon: 'https://www.google.com/s2/favicons?domain=discord.js.org&sz=128',
  },
  {
    href: '/bots/uranus',
    label: 'Uranus',
    color: 'text-uranus',
    dot: 'bg-uranus',
    desc: 'Rust / Serenity',
    favicon: 'https://www.google.com/s2/favicons?domain=rust-lang.org&sz=128',
  },
  {
    href: '/bots/neptune',
    label: 'Neptune',
    color: 'text-neptune',
    dot: 'bg-neptune',
    desc: 'Haskell / discord-haskell',
    favicon: 'https://www.google.com/s2/favicons?domain=www.haskell.org&sz=128',
  },
] as const;

const T = {
  ja: { home: 'ホーム', docs: 'ドキュメント', terms: '利用規約', announcements: 'お知らせ', bots: 'BOT', logout: 'ログアウト', loggedInAs: 'ログイン中', langHref: '?lang=en', langLabel: 'English', login: 'Discord でログイン', loginRequired: 'ログインするとアクセスできます' },
  en: { home: 'Home', docs: 'Docs', terms: 'Terms', announcements: 'Announcements', bots: 'Bots', logout: 'Log out', loggedInAs: 'Logged in as', langHref: '?lang=ja', langLabel: '日本語', login: 'Login with Discord', loginRequired: 'Login to access' },
} as const;

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang: 'ja' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'ja';
  const t = T[lang];

  function langHref() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang === 'ja' ? 'en' : 'ja');
    return `${pathname}?${params.toString()}`;
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-surface-alt border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-2 group">
          <span className="text-2xl">🪐</span>
          <span className="font-bold text-base text-text-base group-hover:text-accent-blue transition-colors">
            Exora
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Home */}
        <Link
          href={`/?lang=${lang}`}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/'
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-muted hover:text-text-base hover:bg-border/40'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
          </svg>
          {t.home}
        </Link>

        <Link
          href={`/docs?lang=${lang}`}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive('/docs')
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-muted hover:text-text-base hover:bg-border/40'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a1 1 0 001-1V6a1 1 0 00-1-1H9a1 1 0 01-1-1V3H4z" />
            <path d="M8 3v2a2 2 0 002 2h7" />
          </svg>
          {t.docs}
        </Link>

        <Link
          href={`/announcements?lang=${lang}`}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive('/announcements')
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-muted hover:text-text-base hover:bg-border/40'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          {t.announcements}
        </Link>

        <Link
          href={`/terms?lang=${lang}`}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive('/terms')
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-muted hover:text-text-base hover:bg-border/40'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-3V3a1 1 0 00-1-1zm0 4a1 1 0 00-1 1v4a1 1 0 002 0V7a1 1 0 00-1-1zM9 15a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
          </svg>
          {t.terms}
        </Link>

        {/* BOT group */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.bots}</p>
        </div>
        {BOT_LINKS.map((b) => {
          const active = isActive(b.href);
          if (!user) {
            // Locked — show as disabled with lock icon
            return (
              <div
                key={b.href}
                title={t.loginRequired}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted/40 cursor-not-allowed select-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.favicon}
                  alt={`${b.label} icon`}
                  width={14}
                  height={14}
                  className="rounded-sm shrink-0 opacity-60"
                />
                <span className="truncate flex-1">{b.label}</span>
                <svg className="w-3 h-3 shrink-0 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            );
          }
          return (
            <Link
              key={b.href}
              href={`${b.href}?lang=${lang}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? `bg-border/60 ${b.color} font-medium`
                  : 'text-text-muted hover:text-text-base hover:bg-border/40'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.favicon}
                alt={`${b.label} icon`}
                width={14}
                height={14}
                className="rounded-sm shrink-0"
              />
              <span className="truncate">{b.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: lang + user */}
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
          /* Logged in: show avatar + username + logout */
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.globalName ?? user.username}
              width={28}
              height={28}
              className="rounded-full shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-base truncate">
                {user.globalName ?? user.username}
              </p>
              <p className="text-[10px] text-text-muted">{t.loggedInAs}</p>
            </div>
            <a
              href="/api/auth/logout"
              title={t.logout}
              className="text-text-muted hover:text-red-400 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ) : (
          /* Not logged in: show login button */
          <a
            href="/api/auth/login"
            className="flex items-center justify-center gap-2 mx-1 py-2 rounded-lg text-xs font-semibold bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.024.016.046.034.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            {t.login}
          </a>
        )}
      </div>
    </aside>
  );
}

