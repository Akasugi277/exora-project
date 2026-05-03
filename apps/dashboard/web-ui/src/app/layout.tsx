import type { Metadata } from 'next';
import { Suspense } from 'react';
import TopRightControls from '@/components/TopRightControls';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Exora Dashboard',
  description: 'Exora Series Bot Status Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                const fontSize = localStorage.getItem('exora-font-size');
                if (fontSize === 'small' || fontSize === 'large') {
                  document.documentElement.setAttribute('data-font-size', fontSize);
                }
              } catch (_) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();`,
          }}
        />
      </head>
      <body className="bg-surface text-text-base antialiased">
        <Suspense>
          <TopRightControls />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
