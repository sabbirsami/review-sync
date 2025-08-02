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
        <main className="bg-[#F8F8F8]">{children}</main>
      </body>
    </html>
  );
}
