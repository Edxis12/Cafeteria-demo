import dynamic from 'next/dynamic';
import { supabase } from '@/src/lib/supabase';
import { Navbar } from '@/src/components/layout/Navbar';
import { Hero } from '@/src/components/home/Hero';
import { Highlights } from '@/src/components/home/HighLights';
import { FeaturedSection, MenuItem } from '@/src/components/home/FeaturedSection';
import { InteractiveMenu } from '@/src/components/menu/InteractiveMenu';
import { FooterSection } from '@/src/components/home/FooterSection';
import { ScrollReveal } from '@/src/components/shared/ScrollReveal';
import { SessionGuard } from '@/src/components/shared/SessionGuard';
import { LocationSection } from '@/src/components/home/LocationSection';

// 1. Carga diferida de ReservationForm (desacopla react-hook-form y zod del bundle principal)
const DynamicReservationForm = dynamic(
  () =>
    import('@/src/components/home/ReservationForm').then(
      (mod) => mod.ReservationForm
    ),
  {
    loading: () => (
      <div className="w-full max-w-4xl mx-auto h-[480px] rounded-3xl bg-[#14110E]/50 border border-[#2D2620] animate-pulse my-12" />
    ),
  }
);

// 2. Chunks diferidos para widgets secundarios
const DynamicWhatsAppWidget = dynamic(() =>
  import('@/src/components/shared/WhatsAppWidget').then(
    (mod) => mod.WhatsAppWidget
  )
);

const DynamicCookieBanner = dynamic(() =>
  import('@/src/components/shared/CookieBanner').then(
    (mod) => mod.CookieBanner
  )
);

// Revalidación incremental (ISR): la página se consulta a Supabase máximo 1 vez cada 60 segundos
export const revalidate = 60;

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as MenuItem[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const menuItems = await getMenuItems();

  return (
    <main className="min-h-screen w-full bg-[#100D0A] text-[#F8F5F2] overflow-x-hidden relative">
      <SessionGuard />
      <Navbar />

      <Hero />

      <ScrollReveal direction="up" delay={0.1}>
        <Highlights />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <FeaturedSection items={menuItems} />
      </ScrollReveal>

      <div id="menu">
        <ScrollReveal direction="up" delay={0.1}>
          <InteractiveMenu initialItems={menuItems} />
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.1}>
        <DynamicReservationForm />
      </ScrollReveal>

      <LocationSection />

      <FooterSection />

      <DynamicWhatsAppWidget />
      <DynamicCookieBanner />
    </main>
  );
}