import { notFound } from 'next/navigation';
import GuildSettingsPageClient from '@/components/GuildSettingsPageClient';
import { isBotKey } from '@/lib/bot-meta';

type Lang = 'ja' | 'en';
type SectionKey = 'home' | 'notifications' | 'nickname' | 'time-language' | 'commands' | 'roles-permissions' | 'feature-member-join-leave' | 'feature-activity-role' | 'feature-levels' | 'feature-translation' | 'feature-polls' | 'feature-quote' | 'feature-music' | 'feature-logs' | 'posting-editing';

const SECTIONS = new Set<SectionKey>([
  'home',
  'notifications',
  'nickname',
  'time-language',
  'commands',
  'roles-permissions',
  'feature-member-join-leave',
  'feature-activity-role',
  'feature-levels',
  'feature-translation',
  'feature-polls',
  'feature-quote',
  'feature-music',
  'feature-logs',
  'posting-editing',
]);

export default async function GuildSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ bot: string; guildId: string; section?: string[] }>;
  searchParams: Promise<{ lang?: string; guildName?: string; guildIcon?: string }>;
}) {
  const { bot, guildId, section: sectionParam } = await params;
  if (!isBotKey(bot)) notFound();

  const { lang: langParam, guildName, guildIcon } = await searchParams;
  const lang: Lang = langParam === 'en' ? 'en' : 'ja';
  const section = (sectionParam?.[0] ?? 'home') as SectionKey;

  if (!SECTIONS.has(section)) notFound();

  return (
    <GuildSettingsPageClient
      bot={bot}
      guildId={guildId}
      guildName={guildName ?? `Guild ${guildId}`}
      guildIcon={guildIcon ?? null}
      lang={lang}
      section={section}
    />
  );
}