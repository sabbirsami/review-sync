import { ThemeProvider } from '@/components/provider/theme/theme-provider';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import type React from 'react';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReviewSync - Google Review Management Dashboard',
  description: 'Manage Google Business reviews and automated replies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <main className="bg-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
