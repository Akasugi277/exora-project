'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface SidebarUser {
  username: string;
  globalName: string | null;
  avatarUrl: string;
}

interface SidebarProps {
  user: SidebarUser;
}

const BOT_LINKS = [
  { href: '/bots/jupiter', label: 'Jupiter', color: 'text-jupiter', dot: 'bg-jupiter', desc: 'Java / Discord4J' },
  { href: '/bots/saturn',  label: 'Saturn',  color: 'text-saturn',  dot: 'bg-saturn',  desc: 'TypeScript / discord.js' },
  { href: '/bots/uranus',  label: 'Uranus',  color: 'text-uranus',  dot: 'bg-uranus',  desc: 'Rust / Serenity' },
  { href: '/bots/neptune', label: 'Neptune', color: 'text-neptune', dot: 'bg-neptune', desc: 'Haskell / discord-haskell' },
] as const;

const T = {
  ja: { home: 'ホーム', bots: 'BOT', logout: 'ログアウト', loggedInAs: 'ログイン中', langHref: '?lang=en', langLabel: 'English' },
  en: { home: 'Home',  bots: 'Bots', logout: 'Log out', loggedInAs: 'Logged in as', langHref: '?lang=ja', langLabel: '日本語' },
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

        {/* BOT group */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.bots}</p>
        </div>
        {BOT_LINKS.map((b) => {
          const active = isActive(b.href);
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
              <span className={`w-2 h-2 rounded-full shrink-0 ${b.dot}`} />
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

        {/* User */}
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
      </div>
    </aside>
  );
}
