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
  inviteUrl: string;
}

export const BOT_META: Record<BotKey, BotMeta> = {
  jupiter: {
    num: 1,
    language: 'Java 21 / Discord4J 3.2.6',
    color: 'rgb(var(--color-jupiter))',
    accentClass: 'text-jupiter',
    bgClass: 'bg-jupiter/10',
    borderClass: 'border-jupiter/40',
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1499401807493988553',
  },
  saturn: {
    num: 2,
    language: 'TypeScript / discord.js v14',
    color: 'rgb(var(--color-saturn))',
    accentClass: 'text-saturn',
    bgClass: 'bg-saturn/10',
    borderClass: 'border-saturn/40',
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1499401951761272912',
  },
  uranus: {
    num: 3,
    language: 'Rust / Serenity 0.12',
    color: 'rgb(var(--color-uranus))',
    accentClass: 'text-uranus',
    bgClass: 'bg-uranus/10',
    borderClass: 'border-uranus/40',
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1499402051371663520',
  },
  neptune: {
    num: 4,
    language: 'Haskell / discord-haskell 1.18',
    color: 'rgb(var(--color-neptune))',
    accentClass: 'text-neptune',
    bgClass: 'bg-neptune/10',
    borderClass: 'border-neptune/40',
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1499402148176466101',
  },
};

export function isBotKey(val: string): val is BotKey {
  return BOT_KEYS.includes(val as BotKey);
}
