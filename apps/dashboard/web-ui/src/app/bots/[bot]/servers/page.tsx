import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isBotKey, BOT_META } from '@/lib/bot-meta';
import type { BotKey } from '@/lib/bot-meta';
import ServersClient from '@/components/ServersClient';

export default async function ServersPage({
  params,
}: {
  params: Promise<{ bot: string }>;
}) {
  const { bot } = await params;
  if (!isBotKey(bot)) notFound();

  const meta = BOT_META[bot as BotKey];

  return (
    <Suspense>
      <ServersClient
        bot={bot}
        accentClass={meta.accentClass}
        borderClass={meta.borderClass}
        bgClass={meta.bgClass}
      />
    </Suspense>
  );
}
