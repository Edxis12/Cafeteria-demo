import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#100D0A',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'VELVET Roasters | Café de Especialidad',
  description: 'Café de origen seleccionado, tueste artesanal y repostería de autor. Reserva tu mesa en línea.',
  keywords: ['cafetería', 'café de especialidad', 'reservas', 'baristas', 'repostería artesanal', 'VELVET Roasters'],
  authors: [{ name: 'VELVET Roasters' }],
  metadataBase: new URL('https://velvet-roasters.vercel.app'),
  openGraph: {
    title: 'VELVET Roasters | Café de Especialidad',
    description: 'Café de origen seleccionado, tueste artesanal y repostería de autor. Reserva tu mesa en línea.',
    url: 'https://velvet-roasters.vercel.app',
    siteName: 'VELVET Roasters',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Ambiente y Café de VELVET Roasters',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELVET Roasters | Café de Especialidad',
    description: 'Café de origen seleccionado, tueste artesanal y repostería de autor.',
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-[#100D0A] text-[#F8F5F2] antialiased min-h-screen w-full overflow-x-hidden selection:bg-[#D57E7E]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}