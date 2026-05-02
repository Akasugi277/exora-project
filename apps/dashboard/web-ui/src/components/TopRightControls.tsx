'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Theme = 'light' | 'dark';

const STORAGE_SYNC = 'exora-theme-sync';
const STORAGE_MANUAL = 'exora-theme-manual';

function resolveSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function TopRightControls() {
  const searchParams = useSearchParams();
  const lang: 'ja' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'ja';

  const [syncWithSystem, setSyncWithSystem] = useState(true);
  const [manualTheme, setManualTheme] = useState<Theme>('dark');
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const savedSync = localStorage.getItem(STORAGE_SYNC);
    const savedManual = localStorage.getItem(STORAGE_MANUAL) as Theme | null;

    const nextSync = savedSync === null ? true : savedSync === 'true';
    const nextManual: Theme = savedManual === 'light' || savedManual === 'dark' ? savedManual : 'dark';

    setSyncWithSystem(nextSync);
    setManualTheme(nextManual);
    applyTheme(nextSync ? resolveSystemTheme() : nextManual);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_SYNC, String(syncWithSystem));
    localStorage.setItem(STORAGE_MANUAL, manualTheme);

    if (syncWithSystem) {
      applyTheme(resolveSystemTheme());
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme(resolveSystemTheme());
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }

    applyTheme(manualTheme);
    return;
  }, [syncWithSystem, manualTheme]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const clockText = useMemo(() => {
    const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: tz,
      timeZoneName: 'short',
    }).format(now);
  }, [lang, now, tz]);

  const t = {
    ja: { now: '現在時刻', light: 'ライト', dark: 'ダーク', system: 'PC同期' },
    en: { now: 'Now', light: 'Light', dark: 'Dark', system: 'System' },
  }[lang];

  const mode: 'light' | 'dark' | 'system' = syncWithSystem ? 'system' : manualTheme;

  return (
    <div className="fixed top-3 right-4 z-40 flex items-center gap-3 rounded-xl border border-border bg-surface-alt/90 backdrop-blur px-3 py-2">
      <div className="hidden sm:block text-right">
        <p className="text-[10px] text-text-muted">{t.now}</p>
        <p className="text-xs font-mono text-text-base whitespace-nowrap">{clockText}</p>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-1 py-1">
        <button
          type="button"
          title={t.light}
          aria-label={t.light}
          onClick={() => {
            setSyncWithSystem(false);
            setManualTheme('light');
          }}
          className={`h-8 w-8 rounded-lg grid place-items-center transition-colors ${
            mode === 'light' ? 'bg-accent-blue/25 text-accent-blue' : 'text-text-muted hover:text-text-base hover:bg-border/30'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </button>

        <button
          type="button"
          title={t.dark}
          aria-label={t.dark}
          onClick={() => {
            setSyncWithSystem(false);
            setManualTheme('dark');
          }}
          className={`h-8 w-8 rounded-lg grid place-items-center transition-colors ${
            mode === 'dark' ? 'bg-accent-blue/25 text-accent-blue' : 'text-text-muted hover:text-text-base hover:bg-border/30'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>

        <button
          type="button"
          title={t.system}
          aria-label={t.system}
          onClick={() => setSyncWithSystem(true)}
          className={`h-8 w-8 rounded-lg grid place-items-center transition-colors ${
            mode === 'system' ? 'bg-accent-blue/25 text-accent-blue' : 'text-text-muted hover:text-text-base hover:bg-border/30'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
