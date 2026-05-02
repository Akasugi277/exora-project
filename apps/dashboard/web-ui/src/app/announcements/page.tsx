import { ANNOUNCEMENTS } from '@/data/announcements';
import AnnouncementList from '@/components/AnnouncementList';

type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'お知らせ',
    subtitle: 'Exora Series からのお知らせ・メンテナンス情報・コミュニティ情報をお届けします。',
    allBadge: 'すべて',
    updated: '最終更新: 2026年5月',
  },
  en: {
    title: 'Announcements',
    subtitle: 'News, maintenance notices, and community updates from Exora Series.',
    allBadge: 'All',
    updated: 'Last updated: May 2026',
  },
} as const;

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];

  return (
    <div className="px-8 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-text-base mb-2">{t.title}</h1>
      <p className="text-sm text-text-muted mb-8">{t.subtitle}</p>

      <AnnouncementList announcements={ANNOUNCEMENTS} lang={lang} />

      <p className="mt-8 text-xs text-text-muted">{t.updated}</p>
    </div>
  );
}
