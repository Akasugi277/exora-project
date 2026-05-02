'use client';

import { useEffect, useState } from 'react';
import type { BotStatus } from '@/app/api/status/route';

type Phase = 'loading' | 'done';

interface Props {
  botName: string;
  lang: string;
  labels: {
    status: string;
    online: string;
    measuring: string;
    offline: string;
    heartbeat: string;
    never: string;
  };
  /** Polling interval in ms (default 10 000) */
  pollInterval?: number;
}

export default function BotStatusHeader({ botName, lang, labels, pollInterval = 10_000 }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { bots: BotStatus[] };
        const found = data.bots.find((b) => b.bot_name === botName) ?? null;
        if (!cancelled) {
          setBotStatus(found);
          setPhase('done');
        }
      } catch {
        if (!cancelled) setPhase('done'); // network error → show unknown
      }
    }

    // Immediate first fetch, then poll
    poll();
    const id = setInterval(poll, pollInterval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [botName, pollInterval]);

  const status = botStatus?.status ?? 'unknown';
  const online = status === 'online';

  return (
    <div className="flex items-center gap-6 mt-5">
      {/* Status */}
      <div>
        <p className="text-[11px] text-text-muted mb-1">{labels.status}</p>
        {phase === 'loading' ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-text-muted">
            <span className="w-2 h-2 rounded-full bg-text-muted animate-pulse" />
            {labels.measuring}
          </span>
        ) : (
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${
            online ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              online ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
            }`} />
            {online ? labels.online : labels.offline}
          </span>
        )}
      </div>

      {/* Last heartbeat */}
      <div>
        <p className="text-[11px] text-text-muted mb-1">{labels.heartbeat}</p>
        {phase === 'loading' ? (
          <p className="text-sm font-mono text-text-muted animate-pulse">—</p>
        ) : (
          <p className="text-sm font-mono text-text-base">
            {botStatus?.last_heartbeat_at
              ? new Date(botStatus.last_heartbeat_at).toLocaleString(
                  lang === 'ja' ? 'ja-JP' : 'en-US',
                )
              : labels.never}
          </p>
        )}
      </div>
    </div>
  );
}
