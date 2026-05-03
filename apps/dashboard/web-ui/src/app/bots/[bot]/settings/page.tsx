import { notFound } from 'next/navigation';
import { isBotKey } from '@/lib/bot-meta';
import ComingSoon from '@/components/ComingSoon';

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'サーバー設定',
    desc: '管理者権限を持つサーバーの BOT 設定を管理予定です。',
  },
  en: {
    title: 'Server Settings',
    desc: 'Manage bot settings for servers where you have administrator permissions.',
  },
} as const;

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ bot: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { bot } = await params;
  if (!isBotKey(bot)) notFound();

  const { lang: langParam } = await searchParams;
  const lang: Lang = langParam === 'en' ? 'en' : 'ja';
  const t = T[lang];

  return (
    <div className="px-8 py-8 max-w-4xl">
      <ComingSoon title={t.title} description={t.desc} />
    </div>
  );
}
