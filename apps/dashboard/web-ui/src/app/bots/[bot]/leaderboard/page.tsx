import { notFound } from 'next/navigation';
import { isBotKey } from '@/lib/bot-meta';
import ComingSoon from '@/components/ComingSoon';

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'リーダーボード',
    desc: 'BOT に紐づけられたユーザーのランキングを表示予定です。',
  },
  en: {
    title: 'Leaderboard',
    desc: 'Per-bot user rankings will be shown here.',
  },
} as const;

export default async function LeaderboardPage({
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
