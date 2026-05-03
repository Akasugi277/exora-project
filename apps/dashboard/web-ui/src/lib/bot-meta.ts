export type BotKey = 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export const BOT_KEYS: readonly BotKey[] = ['jupiter', 'saturn', 'uranus', 'neptune'];

export const BOT_FAVICONS: Record<BotKey, string> = {
  jupiter: 'https://www.google.com/s2/favicons?domain=discord4j.com&sz=128',
  saturn: 'https://www.google.com/s2/favicons?domain=discord.js.org&sz=128',
  uranus: 'https://www.google.com/s2/favicons?domain=rust-lang.org&sz=128',
  neptune: 'https://www.google.com/s2/favicons?domain=www.haskell.org&sz=128',
};

export interface BotMeta {
  num: number;
  language: string;
  color: string;
  accentClass: string;
  bgClass: string;
  borderClass: string;
}

export const BOT_META: Record<BotKey, BotMeta> = {
  jupiter: {
    num: 1,
    language: 'Java 21 / Discord4J 3.2.6',
    color: '#d97706',
    accentClass: 'text-jupiter',
    bgClass: 'bg-jupiter/10',
    borderClass: 'border-jupiter/40',
  },
  saturn: {
    num: 2,
    language: 'TypeScript / discord.js v14',
    color: '#a78bfa',
    accentClass: 'text-saturn',
    bgClass: 'bg-saturn/10',
    borderClass: 'border-saturn/40',
  },
  uranus: {
    num: 3,
    language: 'Rust / Serenity 0.12',
    color: '#67e8f9',
    accentClass: 'text-uranus',
    bgClass: 'bg-uranus/10',
    borderClass: 'border-uranus/40',
  },
  neptune: {
    num: 4,
    language: 'Haskell / discord-haskell 1.18',
    color: '#34d399',
    accentClass: 'text-neptune',
    bgClass: 'bg-neptune/10',
    borderClass: 'border-neptune/40',
  },
};

export function isBotKey(val: string): val is BotKey {
  return BOT_KEYS.includes(val as BotKey);
}
