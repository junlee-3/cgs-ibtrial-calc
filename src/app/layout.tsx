import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'CGS IB Trial Grade Calculator',
  description:
    'For Canberra Grammar School students: predict your IB grades from trial exam marks using the CGS 2026 grade boundaries. Exam papers only — IAs are not counted.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} relative min-h-dvh text-foreground antialiased`}>
        <div className="atmosphere" aria-hidden />
        <div className="relative z-10 flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
