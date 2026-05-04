import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { isBotKey, BOT_META } from '@/lib/bot-meta';
import type { BotKey } from '@/lib/bot-meta';
import BotContextSidebar from '@/components/BotContextSidebar';

function sidebarAvatarUrl(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}

export default async function BotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ bot: string }>;
}) {
  const { bot } = await params;

  if (!isBotKey(bot)) notFound();

  const user = await getSessionUser();
  const sidebarUser = user
    ? { username: user.username, globalName: user.global_name, avatarUrl: sidebarAvatarUrl(user) }
    : null;

  return (
    <div className="flex min-h-screen">
      <Suspense>
        <BotContextSidebar bot={bot as BotKey} user={sidebarUser} />
      </Suspense>
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(BOT_META).map((bot) => ({ bot }));
}
