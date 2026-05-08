'use client';

import { useEffect, useState } from 'react';
import type { BotStatus } from '@/app/api/status/route';
import BotStatusCard from './BotStatusCard';

const BOT_META: Record<string, { num: number; lang: string; color: string }> = {
  jupiter: { num: 1, lang: 'Java / Discord4J',          color: 'rgb(var(--color-jupiter))' },
  saturn:  { num: 2, lang: 'TypeScript / discord.js',   color: 'rgb(var(--color-saturn))' },
  uranus:  { num: 3, lang: 'Rust / Serenity',           color: 'rgb(var(--color-uranus))' },
  neptune: { num: 4, lang: 'Haskell / discord-haskell', color: 'rgb(var(--color-neptune))' },
};

function sortBotsStable(list: BotStatus[]): BotStatus[] {
  return [...list].sort((a, b) => {
    const an = BOT_META[a.bot_name]?.num ?? Number.MAX_SAFE_INTEGER;
    const bn = BOT_META[b.bot_name]?.num ?? Number.MAX_SAFE_INTEGER;
    if (an !== bn) return an - bn;
    return a.bot_name.localeCompare(b.bot_name);
  });
}

interface Props {
  initialBots: BotStatus[];
  lang: string;
  labels: {
    online: string;
    offline: string;
    measuring: string;
    heartbeat: string;
    never: string;
    unit: string;
  };
  /** Polling interval in milliseconds. Default: 10 000 (10 s) */
  pollInterval?: number;
}

export default function BotStatusGrid({ initialBots, lang, labels, pollInterval = 10_000 }: Props) {
  const [bots, setBots] = useState<BotStatus[]>(sortBotsStable(initialBots));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { bots: BotStatus[] };
        if (!cancelled && data.bots.length > 0) {
          setBots(sortBotsStable(data.bots));
          setLastUpdated(new Date());
          setIsInitialLoading(false);
        }
      } catch {
        // network error — keep current data
        if (!cancelled) setIsInitialLoading(false);
      }
    }

    poll();
    const id = setInterval(poll, pollInterval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollInterval]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {bots.map((bot) => {
          const meta = BOT_META[bot.bot_name] ?? { num: 0, lang: bot.language, color: '#8b949e' };
          return (
            <BotStatusCard
              key={bot.bot_name}
              name={bot.bot_name}
              language={meta.lang}
              status={isInitialLoading ? 'loading' : bot.status}
              lastHeartbeat={isInitialLoading ? null : bot.last_heartbeat_at}
              color={meta.color}
              num={meta.num}
              lang={lang}
              labels={labels}
            />
          );
        })}
      </div>
      {lastUpdated && (
        <p className="mt-3 text-[11px] text-text-muted text-right">
          {lang === 'ja'
            ? `最終取得: ${lastUpdated.toLocaleTimeString('ja-JP')} (${pollInterval / 1000}秒ごとに自動更新)`
            : `Last fetched: ${lastUpdated.toLocaleTimeString('en-US')} (auto-refresh every ${pollInterval / 1000}s)`}
        </p>
      )}
    </div>
  );
}
