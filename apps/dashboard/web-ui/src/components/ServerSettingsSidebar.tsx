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
  guildId: string;
  user: SidebarUser | null;
}

interface ServerNavItem {
  href: string;
  label: string;
  badge?: string;
}

interface ServerNavGroup {
  title: string | null;
  items: ServerNavItem[];
}

const T = {
  ja: {
    backToMain: 'Exora メインへ',
    backToServers: 'サーバー一覧へ',
    logout: 'ログアウト',
    loggedInAs: 'ログイン中',
    unit: 'ユニット',
    home: 'ホーム',
    notifications: '通知',
    basics: '基本設定',
    nickname: 'BOTのニックネーム',
    timeAndLanguage: '時刻と言語',
    commands: 'コマンド',
    moderation: 'モデレーションと管理',
    rolesAndPermissions: '役職と権限',
    features: '機能とオプション',
    featureMemberJoinLeave: 'メンバーの追加/退出メッセージ',
    featureActivityRole: 'アクティビティロール',
    featureLevels: 'レベル',
    featureTranslation: '翻訳',
    featurePolls: '投票',
    featureQuote: 'メッセージの引用',
    featureMusic: '音楽',
    featureLogs: 'ログ',
    pages: 'サーバーページ',
    postingAndEditing: '投稿と編集',
    comingSoon: '準備中',
    langLabel: 'English',
  },
  en: {
    backToMain: 'Back to Exora',
    backToServers: 'Back to servers',
    logout: 'Log out',
    loggedInAs: 'Logged in as',
    unit: 'Unit',
    home: 'Home',
    notifications: 'Notifications',
    basics: 'Basic Settings',
    nickname: 'Bot Nickname',
    timeAndLanguage: 'Time and Language',
    commands: 'Commands',
    moderation: 'Moderation & Management',
    rolesAndPermissions: 'Roles and Permissions',
    features: 'Features and Options',
    featureMemberJoinLeave: 'Member Join/Leave Messages',
    featureActivityRole: 'Activity Role',
    featureLevels: 'Levels',
    featureTranslation: 'Translation',
    featurePolls: 'Polls',
    featureQuote: 'Message Quoting',
    featureMusic: 'Music',
    featureLogs: 'Logs',
    pages: 'Server Pages',
    postingAndEditing: 'Post and Edit',
    comingSoon: 'Coming soon',
    langLabel: '日本語',
  },
} as const;

export default function ServerSettingsSidebar({ bot, guildId, user }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang: 'ja' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'ja';
  const t = T[lang];
  const meta = BOT_META[bot];
  const favicon = BOT_FAVICONS[bot];
  const displayName = bot.charAt(0).toUpperCase() + bot.slice(1);
  const guildName = searchParams.get('guildName') ?? `Guild ${guildId}`;

  function withLangAndGuild(href: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    return `${href}?${params.toString()}`;
  }

  function langHref() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang === 'ja' ? 'en' : 'ja');
    return `${pathname}?${params.toString()}`;
  }

  function isActive(href: string) {
    return pathname === href;
  }

  const groups: ServerNavGroup[] = [
    {
      title: null,
      items: [
        { href: `/bots/${bot}/servers/${guildId}`, label: t.home },
        { href: `/bots/${bot}/servers/${guildId}/notifications`, label: t.notifications },
      ],
    },
    {
      title: t.basics,
      items: [
        { href: `/bots/${bot}/servers/${guildId}/nickname`, label: t.nickname },
        { href: `/bots/${bot}/servers/${guildId}/time-language`, label: t.timeAndLanguage },
        { href: `/bots/${bot}/servers/${guildId}/commands`, label: t.commands },
      ],
    },
    {
      title: t.moderation,
      items: [
        { href: `/bots/${bot}/servers/${guildId}/roles-permissions`, label: t.rolesAndPermissions },
      ],
    },
    {
      title: t.features,
      items: [
        { href: `/bots/${bot}/servers/${guildId}/feature-member-join-leave`, label: t.featureMemberJoinLeave },
        { href: `/bots/${bot}/servers/${guildId}/feature-activity-role`, label: t.featureActivityRole },
        { href: `/bots/${bot}/servers/${guildId}/feature-levels`, label: t.featureLevels },
        { href: `/bots/${bot}/servers/${guildId}/feature-translation`, label: t.featureTranslation },
        { href: `/bots/${bot}/servers/${guildId}/feature-polls`, label: t.featurePolls },
        { href: `/bots/${bot}/servers/${guildId}/feature-quote`, label: t.featureQuote },
        { href: `/bots/${bot}/servers/${guildId}/feature-music`, label: t.featureMusic },
        { href: `/bots/${bot}/servers/${guildId}/feature-logs`, label: t.featureLogs },
      ],
    },
    {
      title: t.pages,
      items: [
        { href: `/bots/${bot}/servers/${guildId}/posting-editing`, label: t.postingAndEditing, badge: t.comingSoon },
      ],
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-surface-alt border-r border-border flex flex-col z-30">
      <div className="px-5 py-5 border-b border-border space-y-3">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-base transition-colors group">
          <svg className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="flex items-center gap-1"><span className="text-base leading-none">🪐</span>{t.backToMain}</span>
        </Link>

        <Link href={withLangAndGuild(`/bots/${bot}/servers`)} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-base transition-colors group">
          <svg className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>{t.backToServers}</span>
        </Link>

        <div className={`rounded-xl border ${meta.borderClass} ${meta.bgClass} px-3 py-2.5`}>
          <p className="text-[10px] text-text-muted mb-0.5">{t.unit} #{meta.num}</p>
          <div className="flex items-center gap-2">
            <img src={favicon} alt={`${displayName} icon`} width={18} height={18} className="rounded-sm shrink-0" />
            <span className={`text-base font-bold ${meta.accentClass}`}>{displayName}</span>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">{meta.language}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface px-3 py-2.5">
          <p className="text-sm font-semibold text-text-base truncate">{guildName}</p>
          <p className="text-[10px] text-text-muted truncate">ID: {guildId}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {groups.map((group, groupIndex) => (
          <div key={group.title ?? `group-${groupIndex}`} className="space-y-1">
            {group.title && <p className="px-3 pb-1 text-[11px] font-semibold text-text-base">{group.title}</p>}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={withLangAndGuild(item.href)}
                  className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? `bg-border/60 ${meta.accentClass}` : 'text-text-muted hover:text-text-base hover:bg-border/40'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-border text-text-muted shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-3 space-y-2">
        <Link href={langHref()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-base hover:bg-border/40 transition-colors">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-3.754 1 1 0 111.94-.482c.26 1.04.698 2.01 1.268 2.893.484-.894.847-1.884 1.068-2.911H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
          </svg>
          {t.langLabel}
        </Link>

        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
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
        ) : null}
      </div>
    </aside>
  );
}