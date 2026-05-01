import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSessionUser } from '@/lib/session';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Exora Dashboard',
  description: 'Exora Series Bot Status Dashboard',
};

function sidebarAvatarUrl(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>): string {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<unknown>;
}) {
  void params;
  const user = await getSessionUser();

  // If not logged in, middleware will redirect before we render — but guard defensively.
  const sidebarUser = user
    ? {
        username: user.username,
        globalName: user.global_name,
        avatarUrl: sidebarAvatarUrl(user),
      }
    : null;

  return (
    <html lang="ja">
      <body className="bg-surface text-text-base antialiased">
        {sidebarUser ? (
          <div className="flex min-h-screen">
            <Suspense>
              <Sidebar user={sidebarUser} />
            </Suspense>
            <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
              {children}
            </main>
          </div>
        ) : (
          // Not logged in — render without sidebar (public pages)
          <main className="min-h-screen">{children}</main>
        )}
      </body>
    </html>
  );
}
