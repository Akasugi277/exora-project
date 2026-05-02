'use client';

import { useEffect, useState, useCallback } from 'react';

interface HeartbeatEntry {
  logged_at: string;
}

interface Props {
  botName: string;
  /** Window to display in minutes (default 10) */
  minutes?: number;
  /** Polling interval in ms (default 10 000) */
  pollInterval?: number;
  accentColor: string;
  lang?: string;
}

const W = 600;
const H = 64;
const DOT_R = 3.5;
const GAP_THRESHOLD_S = 20; // gap > 20 s is considered a missed beat

export default function HeartbeatChart({
  botName,
  minutes = 10,
  pollInterval = 10_000,
  accentColor,
  lang = 'ja',
}: Props) {
  const [beats, setBeats] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/bots/${botName}/heartbeats?minutes=${minutes}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { heartbeats: HeartbeatEntry[] };
      setBeats(data.heartbeats.map((h) => new Date(h.logged_at)));
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, [botName, minutes]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, pollInterval);
    return () => clearInterval(id);
  }, [fetch_, pollInterval]);

  // ── layout ──────────────────────────────────────────────────────────────────
  const now = new Date();
  const windowMs = minutes * 60 * 1000;
  const start = new Date(now.getTime() - windowMs);

  function toX(d: Date) {
    return ((d.getTime() - start.getTime()) / windowMs) * W;
  }

  const cy = H / 2;

  // Build gap segments (red rectangles behind the dots)
  const gaps: Array<{ x1: number; x2: number }> = [];
  const sorted = [...beats].sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < sorted.length; i++) {
    const diffS = (sorted[i].getTime() - sorted[i - 1].getTime()) / 1000;
    if (diffS > GAP_THRESHOLD_S) {
      gaps.push({ x1: toX(sorted[i - 1]), x2: toX(sorted[i]) });
    }
  }
  // Gap from last beat to now
  if (sorted.length > 0) {
    const lastDiffS = (now.getTime() - sorted[sorted.length - 1].getTime()) / 1000;
    if (lastDiffS > GAP_THRESHOLD_S) {
      gaps.push({ x1: toX(sorted[sorted.length - 1]), x2: W });
    }
  }

  // Axis labels
  const axisLabels: Array<{ x: number; label: string }> = [];
  for (let i = 0; i <= 4; i++) {
    const d = new Date(start.getTime() + (windowMs * i) / 4);
    axisLabels.push({
      x: (W * i) / 4,
      label: d.toLocaleTimeString(lang === 'ja' ? 'ja-JP' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
  }

  const label = {
    ja: { title: 'ハートビート履歴', window: `直近 ${minutes} 分`, beats: 'ビート数', noData: 'データを収集中…' },
    en: { title: 'Heartbeat History', window: `Last ${minutes} min`, beats: 'beats', noData: 'Collecting data…' },
  }[lang === 'ja' ? 'ja' : 'en'];

  return (
    <div className="rounded-xl border border-border bg-surface-alt p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-text-base">{label.title}</p>
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span>{label.window}</span>
          <span style={{ color: accentColor }}>
            {beats.length} {label.beats}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="h-16 flex items-center justify-center text-xs text-text-muted animate-pulse">
          {label.noData}
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H + 18}`}
          className="w-full"
          aria-label={label.title}
        >
          {/* background */}
          <rect width={W} height={H} rx="6" fill="rgba(255,255,255,0.03)" />

          {/* gap highlights */}
          {gaps.map((g, i) => (
            <rect
              key={i}
              x={g.x1}
              y={0}
              width={Math.max(1, g.x2 - g.x1)}
              height={H}
              fill="rgba(239,68,68,0.15)"
            />
          ))}

          {/* baseline */}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* beat dots */}
          {sorted.map((d, i) => (
            <circle
              key={i}
              cx={toX(d)}
              cy={cy}
              r={DOT_R}
              fill={accentColor}
              opacity="0.85"
            />
          ))}

          {/* axis labels */}
          {axisLabels.map((l) => (
            <text
              key={l.x}
              x={l.x}
              y={H + 14}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.3)"
            >
              {l.label}
            </text>
          ))}

          {/* "now" marker */}
          <line x1={W} y1={0} x2={W} y2={H} stroke={accentColor} strokeWidth="1.5" opacity="0.5" strokeDasharray="3,3" />
        </svg>
      )}

      {/* legend */}
      <div className="flex gap-4 mt-2 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          {lang === 'ja' ? 'ハートビート' : 'Heartbeat'}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.4)' }} />
          {lang === 'ja' ? 'ギャップ (>20s)' : 'Gap (>20s)'}
        </span>
      </div>
    </div>
  );
}
