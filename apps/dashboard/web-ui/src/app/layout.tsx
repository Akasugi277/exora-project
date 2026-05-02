import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSessionUser } from '@/lib/session';
import Sidebar from '@/components/Sidebar';
import TopRightControls from '@/components/TopRightControls';
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const sync = localStorage.getItem('exora-theme-sync');
                const manual = localStorage.getItem('exora-theme-manual');
                const syncWithSystem = sync === null ? true : sync === 'true';
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = syncWithSystem
                  ? (systemDark ? 'dark' : 'light')
                  : (manual === 'light' || manual === 'dark' ? manual : 'dark');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (_) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();`,
          }}
        />
      </head>
      <body className="bg-surface text-text-base antialiased">
        <div className="flex min-h-screen">
          <Suspense>
            <Sidebar user={sidebarUser} />
          </Suspense>
          <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
            <TopRightControls />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
