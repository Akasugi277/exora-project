type Lang = 'ja' | 'en';

const T = {
  ja: {
    title: '利用規約',
    subtitle: '本サービスをご利用いただく前に、以下の利用規約をお読みください。',
    sec1: '1. サービスの目的',
    sec1Body:
      'Exora ダッシュボードは、Exora Series が運営する Discord BOT の稼働状態をリアルタイムで確認するための内部管理ツールです。外部への無断公開・転載はご遠慮ください。',
    sec2: '2. アカウントと認証',
    sec2Body:
      'ダッシュボードへのログインには Discord OAuth2 を使用します。許可されたアカウントのみアクセス可能です。第三者へのアカウント情報の共有は禁止されています。',
    sec3: '3. 禁止事項',
    sec3Body:
      '・サービスへの不正アクセスまたはその試み\n・自動化ツールによる過度なリクエスト送信\n・管理者の許可なくシステムに影響を与える行為\n・本サービスを利用した違法行為',
    sec4: '4. 免責事項',
    sec4Body:
      'Exora ダッシュボードは現状有姿にて提供されます。メンテナンス・障害等によるサービス停止に関して、運営は責任を負いかねます。',
    sec5: '5. 規約の変更',
    sec5Body:
      '本規約は予告なく変更される場合があります。変更後も継続してサービスをご利用の場合、変更後の規約に同意したものとみなします。',
    updated: '最終更新: 2026年5月',
  },
  en: {
    title: 'Terms of Service',
    subtitle: 'Please read the following terms before using this service.',
    sec1: '1. Purpose of Service',
    sec1Body:
      'The Exora Dashboard is an internal management tool for monitoring the operational status of Discord bots operated by Exora Series. Unauthorized public disclosure or reproduction is prohibited.',
    sec2: '2. Account & Authentication',
    sec2Body:
      'Login to the dashboard uses Discord OAuth2. Only authorized accounts may access the service. Sharing account credentials with third parties is prohibited.',
    sec3: '3. Prohibited Activities',
    sec3Body:
      '· Unauthorized access or attempts to access the service\n· Sending excessive requests via automated tools\n· Actions that affect the system without administrator permission\n· Any illegal activities using this service',
    sec4: '4. Disclaimer',
    sec4Body:
      'The Exora Dashboard is provided "as is." We are not responsible for service interruptions due to maintenance or failures.',
    sec5: '5. Changes to Terms',
    sec5Body:
      'These terms may be changed without notice. Continued use of the service after changes constitutes acceptance of the updated terms.',
    updated: 'Last updated: May 2026',
  },
} as const;

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : 'ja';
  const t = T[lang];

  const sections = [
    { title: t.sec1, body: t.sec1Body },
    { title: t.sec2, body: t.sec2Body },
    { title: t.sec3, body: t.sec3Body },
    { title: t.sec4, body: t.sec4Body },
    { title: t.sec5, body: t.sec5Body },
  ] as const;

  return (
    <div className="px-8 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-text-base mb-2">{t.title}</h1>
      <p className="text-sm text-text-muted mb-8">{t.subtitle}</p>

      <section className="space-y-4">
        {sections.map((s) => (
          <article key={s.title} className="rounded-xl border border-border bg-surface-alt p-5">
            <h2 className="text-sm font-semibold text-text-base mb-2">{s.title}</h2>
            <p className="text-sm text-text-muted leading-7 whitespace-pre-line">{s.body}</p>
          </article>
        ))}
      </section>

      <p className="mt-8 text-xs text-text-muted">{t.updated}</p>
    </div>
  );
}
