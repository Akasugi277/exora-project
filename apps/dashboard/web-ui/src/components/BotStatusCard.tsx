interface BotStatusCardProps {
  name: string;
  language: string;
  status: string;
  lastHeartbeat: string | null;
  color: string;
  num: number;
  lang: string;
  labels: {
    online: string;
    offline: string;
    measuring: string;
    heartbeat: string;
    never: string;
    unit: string;
  };
}

const BOT_FAVICONS: Record<string, string> = {
  jupiter: 'https://www.google.com/s2/favicons?domain=discord4j.com&sz=128',
  saturn: 'https://www.google.com/s2/favicons?domain=discord.js.org&sz=128',
  uranus: 'https://www.google.com/s2/favicons?domain=rust-lang.org&sz=128',
  neptune: 'https://www.google.com/s2/favicons?domain=www.haskell.org&sz=128',
};

function formatHeartbeat(ts: string | null, never: string): string {
  if (!ts) return never;
  const d = new Date(ts);
  return isNaN(d.getTime()) ? never : d.toLocaleString('ja-JP');
}

const COLOR_CLASSES: Record<string, { border: string; dot: string; text: string; bg: string }> = {
  '#d97706': { border: 'border-jupiter/40', dot: 'bg-jupiter', text: 'text-jupiter', bg: 'bg-jupiter/10' },
  '#a78bfa': { border: 'border-saturn/40',  dot: 'bg-saturn',  text: 'text-saturn',  bg: 'bg-saturn/10'  },
  '#67e8f9': { border: 'border-uranus/40',  dot: 'bg-uranus',  text: 'text-uranus',  bg: 'bg-uranus/10'  },
  '#34d399': { border: 'border-neptune/40', dot: 'bg-neptune', text: 'text-neptune', bg: 'bg-neptune/10'  },
};

export default function BotStatusCard({ name, language, status, lastHeartbeat, color, num, lang, labels }: BotStatusCardProps) {
  const cls = COLOR_CLASSES[color] ?? { border: 'border-border', dot: 'bg-text-muted', text: 'text-text-muted', bg: 'bg-border/20' };
  const faviconUrl = BOT_FAVICONS[name.toLowerCase()];
  const loading = status === 'loading';
  const online = status === 'online';

  return (
    <a
      href={`/bots/${name}?lang=${lang}`}
      className={`block rounded-xl border ${cls.border} bg-surface-alt p-5 hover:bg-border/20 transition-colors group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-text-muted mb-0.5">Unit #{num}</p>
          <h3 className={`text-xl font-bold ${cls.text}`}>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
          <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
            {faviconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faviconUrl}
                alt={`${name} runtime`}
                width={14}
                height={14}
                className="rounded-sm shrink-0"
              />
            ) : null}
            <span>{language}</span>
          </p>
        </div>
        {/* Status badge */}
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
          loading
            ? 'status-badge-loading'
            : online
              ? 'status-badge-online'
              : 'status-badge-offline'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            loading ? 'bg-slate-400 animate-pulse' : online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
          }`} />
          {loading ? labels.measuring : online ? labels.online : labels.offline}
        </span>
      </div>

      {/* Heartbeat */}
      <div className={`rounded-lg px-3 py-2 ${cls.bg}`}>
        <p className="text-[11px] text-text-muted mb-0.5">{labels.heartbeat}</p>
        <p className="text-xs font-mono text-text-base">
          {loading ? labels.measuring : formatHeartbeat(lastHeartbeat, labels.never)}
        </p>
      </div>

      {/* Arrow hint */}
      <p className={`text-[11px] mt-3 ${cls.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
        詳細を見る →
      </p>
    </a>
  );
}
