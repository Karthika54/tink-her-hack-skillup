import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppProvider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'SkillLink',
  description: 'A barter-based skill exchange platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'bg-background')}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
