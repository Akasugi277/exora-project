import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'アカウント',
    subtitle: 'Discord アカウントの情報を表示しています。',
    displayName: '表示名',
    username: 'ユーザー名',
    discordId: 'Discord ID',
    logoutButton: 'ログアウト',
    notLoggedIn: 'ログインが必要です',
  },
  en: {
    title: 'Account',
    subtitle: 'Your Discord account information.',
    displayName: 'Display Name',
    username: 'Username',
    discordId: 'Discord ID',
    logoutButton: 'Log out',
    notLoggedIn: 'Login required',
  },
} as const;

function avatarUrl(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];

  const user = await getSessionUser();
  if (!user) redirect('/api/auth/login');

  const avatar = avatarUrl(user);
  const displayName = user.global_name ?? user.username;

  const fields = [
    { label: t.displayName, value: displayName },
    { label: t.username, value: `@${user.username}` },
    { label: t.discordId, value: user.id },
  ] as const;

  return (
    <div className="px-8 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-text-base mb-2">{t.title}</h1>
      <p className="text-sm text-text-muted mb-8">{t.subtitle}</p>

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-surface-alt p-6 flex items-center gap-6 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={displayName}
          width={80}
          height={80}
          className="rounded-full shrink-0 ring-2 ring-accent-blue/40"
        />
        <div className="min-w-0">
          <p className="text-2xl font-bold text-text-base truncate">{displayName}</p>
          <p className="text-sm text-text-muted">@{user.username}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-xl border border-border bg-surface-alt overflow-hidden mb-6">
        {fields.map((f, i) => (
          <div
            key={f.label}
            className={`flex items-center justify-between px-5 py-3.5 ${i !== fields.length - 1 ? 'border-b border-border' : ''}`}
          >
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{f.label}</span>
            <span className="text-sm text-text-base font-mono">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <a
        href="/api/auth/logout"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {t.logoutButton}
      </a>
    </div>
  );
}
