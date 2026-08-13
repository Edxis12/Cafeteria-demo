import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import { Navbar } from '@/src/components/layout/Navbar';
import './globals.css';
import { CookieBanner } from '../components/shared/CookieBanner';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Velvet Roasters | Café de Especialidad',
  description: 'Disfruta del mejor café de origen y repostería artesanal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased bg-[#F8F5F2] dark:bg-[#100D0A]">
        <Navbar />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}