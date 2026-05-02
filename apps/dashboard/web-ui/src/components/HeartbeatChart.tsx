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

interface Tooltip {
  x: number;
  y: number;
  lines: string[];
}

const W = 600;
const H = 64;
const DOT_R = 3.5;
const GAP_THRESHOLD_S = 20; // gap > 20 s is considered a missed beat
const TOOLTIP_W = 140;
const TOOLTIP_H_PER_LINE = 14;
const TOOLTIP_PAD = 6;

export default function HeartbeatChart({
  botName,
  minutes = 10,
  pollInterval = 10_000,
  accentColor,
  lang = 'ja',
}: Props) {
  const [beats, setBeats] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

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

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── layout ──────────────────────────────────────────────────────────────────
  const now = new Date(nowMs);
  const windowMs = minutes * 60 * 1000;
  const start = new Date(now.getTime() - windowMs);

  function toX(d: Date) {
    return ((d.getTime() - start.getTime()) / windowMs) * W;
  }

  const cy = H / 2;

  // Build gap segments (red rectangles behind the dots)
  const gaps: Array<{ x1: number; x2: number; from: Date; to: Date | null }> = [];
  const sorted = [...beats].sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < sorted.length; i++) {
    const diffS = (sorted[i].getTime() - sorted[i - 1].getTime()) / 1000;
    if (diffS > GAP_THRESHOLD_S) {
      gaps.push({ x1: toX(sorted[i - 1]), x2: toX(sorted[i]), from: sorted[i - 1], to: sorted[i] });
    }
  }
  // Gap from last beat to now
  if (sorted.length > 0) {
    const lastDiffS = (now.getTime() - sorted[sorted.length - 1].getTime()) / 1000;
    if (lastDiffS > GAP_THRESHOLD_S) {
      gaps.push({ x1: toX(sorted[sorted.length - 1]), x2: W, from: sorted[sorted.length - 1], to: null });
    }
  }

  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  function fmtTime(d: Date) {
    return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  function fmtDuration(ms: number) {
    const s = Math.round(ms / 1000);
    if (s < 60) return lang === 'ja' ? `${s}秒` : `${s}s`;
    return lang === 'ja' ? `${Math.floor(s / 60)}分${s % 60}秒` : `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  function makeTooltip(x: number, y: number, lines: string[]): Tooltip {
    // Clamp x so tooltip stays within SVG bounds
    const cx = Math.min(Math.max(x - TOOLTIP_W / 2, 4), W - TOOLTIP_W - 4);
    return { x: cx, y, lines };
  }

  // Axis labels
  const axisLabels: Array<{ x: number; label: string }> = [];
  for (let i = 0; i <= 4; i++) {
    const d = new Date(start.getTime() + (windowMs * i) / 4);
    axisLabels.push({
      x: (W * i) / 4,
      label: d.toLocaleTimeString(locale, {
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
    <div className="rounded-xl border border-border bg-surface-alt p-5 relative">
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
          className="w-full cursor-default"
          style={{ overflow: 'visible' }}
          aria-label={label.title}
          onClick={() => setTooltip(null)}
        >
          {/* background */}
          <rect width={W} height={H} rx="6" fill="rgba(255,255,255,0.03)" />

          {/* gap highlights */}
          {gaps.map((g, i) => {
            const gapMs = g.to ? g.to.getTime() - g.from.getTime() : now.getTime() - g.from.getTime();
            const lines = lang === 'ja'
              ? [`ギャップ: ${fmtDuration(gapMs)}`, `開始: ${fmtTime(g.from)}`, `終了: ${g.to ? fmtTime(g.to) : '現在'}`]
              : [`Gap: ${fmtDuration(gapMs)}`, `From: ${fmtTime(g.from)}`, `To: ${g.to ? fmtTime(g.to) : 'now'}`];
            const mx = (g.x1 + g.x2) / 2;
            return (
              <rect
                key={i}
                x={g.x1}
                y={0}
                width={Math.max(1, g.x2 - g.x1)}
                height={H}
                fill="rgba(239,68,68,0.15)"
                className="cursor-pointer hover:fill-red-500/30"
                onClick={(e) => { e.stopPropagation(); setTooltip(makeTooltip(mx, -6, lines)); }}
                onMouseEnter={() => setTooltip(makeTooltip(mx, -6, lines))}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

          {/* baseline */}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* beat dots */}
          {sorted.map((d, i) => {
            const lines = [fmtTime(d)];
            const tx = toX(d);
            return (
              <circle
                key={i}
                cx={tx}
                cy={cy}
                r={DOT_R + 2}
                fill="transparent"
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setTooltip(makeTooltip(tx, cy - DOT_R - 12, lines)); }}
                onMouseEnter={() => setTooltip(makeTooltip(tx, cy - DOT_R - 12, lines))}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
          {sorted.map((d, i) => (
            <circle
              key={`dot-${i}`}
              cx={toX(d)}
              cy={cy}
              r={DOT_R}
              fill={accentColor}
              opacity="0.85"
              style={{ pointerEvents: 'none' }}
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

          {/* tooltip */}
          {tooltip && (() => {
            const th = tooltip.lines.length * TOOLTIP_H_PER_LINE + TOOLTIP_PAD * 2;
            const ty = tooltip.y - th;
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tooltip.x}
                  y={ty}
                  width={TOOLTIP_W}
                  height={th}
                  rx="4"
                  fill="rgba(15,23,42,0.92)"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.8"
                />
                {tooltip.lines.map((line, i) => (
                  <text
                    key={i}
                    x={tooltip.x + TOOLTIP_PAD}
                    y={ty + TOOLTIP_PAD + (i + 1) * TOOLTIP_H_PER_LINE - 2}
                    fontSize="10"
                    fill="rgba(255,255,255,0.9)"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })()}
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
