import { Suspense } from 'react';
import { getSessionUser } from '@/lib/session';
import Sidebar from '@/components/Sidebar';

function sidebarAvatarUrl(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const sidebarUser = user
    ? { username: user.username, globalName: user.global_name, avatarUrl: sidebarAvatarUrl(user) }
    : null;

  return (
    <div className="flex min-h-screen">
      <Suspense>
        <Sidebar user={sidebarUser} />
      </Suspense>
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
