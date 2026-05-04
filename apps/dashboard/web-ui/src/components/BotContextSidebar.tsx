'use client';

import { usePathname } from 'next/navigation';
import BotSidebar from '@/components/BotSidebar';
import ServerSettingsSidebar from '@/components/ServerSettingsSidebar';
import type { BotKey } from '@/lib/bot-meta';

interface SidebarUser {
  username: string;
  globalName: string | null;
  avatarUrl: string;
}

interface Props {
  bot: BotKey;
  user: SidebarUser | null;
}

export default function BotContextSidebar({ bot, user }: Props) {
  const pathname = usePathname();
  const prefix = `/bots/${bot}/servers/`;

  if (pathname.startsWith(prefix)) {
    const rest = pathname.slice(prefix.length);
    const guildId = rest.split('/')[0];

    if (guildId) {
      return <ServerSettingsSidebar bot={bot} guildId={guildId} user={user} />;
    }
  }

  return <BotSidebar bot={bot} user={user} />;
}