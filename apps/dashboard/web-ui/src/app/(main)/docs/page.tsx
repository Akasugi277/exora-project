type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: 'ドキュメント',
    subtitle: 'ログインなしで閲覧できる公開ページです。',
    sec1: 'このページでできること',
    sec1Body: 'Exora ダッシュボードの目的、ハートビート監視、テーマ切替、BOT構成の概要を確認できます。',
    sec2: '公開範囲',
    sec2Body: 'この docs ページとホームは未ログインでも閲覧可能です。BOT の詳細ページはログイン後にアクセスできます。',
    sec3: '補足',
    sec3Body: '運用手順の詳細はリポジトリ直下の docs ディレクトリにある設計ドキュメントを参照してください。',
  },
  en: {
    title: 'Documentation',
    subtitle: 'This is a public page available without login.',
    sec1: 'What you can see here',
    sec1Body: 'Overview of Exora dashboard purpose, heartbeat monitoring, theme controls, and bot composition.',
    sec2: 'Public access scope',
    sec2Body: 'Home and this docs page are publicly accessible. Bot detail pages require login.',
    sec3: 'Note',
    sec3Body: 'For operational details, refer to the design docs in the repository-level docs directory.',
  },
} as const;

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-text-base mb-2">{t.title}</h1>
      <p className="text-sm text-text-muted mb-8">{t.subtitle}</p>

      <section className="space-y-4">
        <article className="rounded-xl border border-border bg-surface-alt p-5">
          <h2 className="text-base font-semibold text-text-base mb-2">{t.sec1}</h2>
          <p className="text-sm text-text-muted leading-6">{t.sec1Body}</p>
        </article>

        <article className="rounded-xl border border-border bg-surface-alt p-5">
          <h2 className="text-base font-semibold text-text-base mb-2">{t.sec2}</h2>
          <p className="text-sm text-text-muted leading-6">{t.sec2Body}</p>
        </article>

        <article className="rounded-xl border border-border bg-surface-alt p-5">
          <h2 className="text-base font-semibold text-text-base mb-2">{t.sec3}</h2>
          <p className="text-sm text-text-muted leading-6">{t.sec3Body}</p>
        </article>
      </section>
    </div>
  );
}
