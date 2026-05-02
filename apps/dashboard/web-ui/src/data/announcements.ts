/**
 * お知らせデータ (静的管理)
 * active: false にすると非表示。後々 DB / API に移行可能。
 */

export type AnnouncementType = 'incident' | 'maintenance' | 'promotion' | 'update' | 'info';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: { ja: string; en: string };
  body: { ja: string; en: string };
  date: string; // YYYY-MM-DD
  link?: string;
  active: boolean;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '001',
    type: 'info',
    title: {
      ja: 'Exora ダッシュボード β 公開',
      en: 'Exora Dashboard β Launch',
    },
    body: {
      ja: 'Exora Series の管理ダッシュボードを正式リリースしました。全 BOT の稼働状況をリアルタイムで確認できます。',
      en: 'The Exora Series admin dashboard is officially live. Monitor all bots in real time.',
    },
    date: '2026-05-03',
    active: true,
  },
  {
    id: '002',
    type: 'promotion',
    title: {
      ja: '公式コミュニティサーバーに参加しよう',
      en: 'Join the Official Community Server',
    },
    body: {
      ja: 'Exora の Discord コミュニティサーバーで最新情報・使い方のサポートを受けることができます。お気軽にご参加ください！',
      en: 'Join the Exora Discord community for the latest updates and usage support. Everyone is welcome!',
    },
    date: '2026-05-01',
    // link: 'https://discord.gg/example',  ← 公開時に設定してください
    active: true,
  },
];
