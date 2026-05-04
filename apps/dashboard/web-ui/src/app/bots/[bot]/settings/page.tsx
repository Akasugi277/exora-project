import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { isBotKey } from '@/lib/bot-meta';

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ bot: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { bot } = await params;
  if (!isBotKey(bot)) notFound();

  const { lang: langParam } = await searchParams;
  const lang = langParam === 'en' ? 'en' : 'ja';

  redirect(`/bots/${bot}/servers?lang=${lang}`);
}
