import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exora Dashboard',
  description: 'Exora Series Bot Status Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}
