import type { Announcement, AnnouncementType } from '@/data/announcements';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AnnouncementType,
  { card: string; badge: string; icon: React.ReactNode; label: { ja: string; en: string } }
> = {
  incident: {
    card: 'ann-card-incident',
    badge: 'ann-badge-incident',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    label: { ja: '障害', en: 'Incident' },
  },
  maintenance: {
    card: 'ann-card-maintenance',
    badge: 'ann-badge-maintenance',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
    label: { ja: 'メンテナンス', en: 'Maintenance' },
  },
  promotion: {
    card: 'ann-card-promotion',
    badge: 'ann-badge-promotion',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
    label: { ja: 'コミュニティ', en: 'Community' },
  },
  update: {
    card: 'ann-card-update',
    badge: 'ann-badge-update',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    label: { ja: 'アップデート', en: 'Update' },
  },
  info: {
    card: 'ann-card-info',
    badge: 'ann-badge-info',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    label: { ja: 'お知らせ', en: 'Info' },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  announcements: Announcement[];
  lang: string;
}

function fmtDate(iso: string, lang: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AnnouncementList({ announcements, lang }: Props) {
  const active = announcements
    .filter((a) => a.active)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-alt/60 px-5 py-4 text-sm text-text-muted">
        {lang === 'ja' ? '現在お知らせはありません。' : 'No announcements at this time.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {active.map((a) => {
        const cfg = TYPE_CONFIG[a.type];
        const title = lang === 'ja' ? a.title.ja : a.title.en;
        const body = lang === 'ja' ? a.body.ja : a.body.en;
        const typeLabel = lang === 'ja' ? cfg.label.ja : cfg.label.en;

        return (
          <div
            key={a.id}
            className={`rounded-xl border ${cfg.card} px-5 py-4`}
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {/* type badge */}
                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                  {cfg.icon}
                  {typeLabel}
                </span>
                <p className="text-sm font-semibold text-text-base truncate">{title}</p>
              </div>
              <time className="text-[11px] text-text-muted shrink-0 mt-0.5">{fmtDate(a.date, lang)}</time>
            </div>
            <p className="text-sm text-text-muted leading-6 ml-0.5">{body}</p>
            {a.link && (
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-accent-blue hover:underline"
              >
                {lang === 'ja' ? '詳細を見る' : 'Learn more'}
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
