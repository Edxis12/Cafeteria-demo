import { supabase } from '@/src/lib/supabase';
import { Navbar } from '@/src/components/layout/Navbar';
import { Hero } from '@/src/components/home/Hero';
import { Highlights } from '@/src/components/home/HighLights';
import { FeaturedSection, MenuItem } from '@/src/components/home/FeaturedSection';
import { InteractiveMenu } from '@/src/components/menu/InteractiveMenu';
import { ReservationForm } from '@/src/components/home/ReservationForm';
import { FooterSection } from '@/src/components/home/FooterSection';
import { WhatsAppWidget } from '@/src/components/shared/WhatsAppWidget';
import { CookieBanner } from '@/src/components/shared/CookieBanner';
import { ScrollReveal } from '@/src/components/shared/ScrollReveal';
import { SessionGuard } from '@/src/components/shared/SessionGuard';

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
  // ÚNICA consulta a la base de datos para toda la landing page
  const menuItems = await getMenuItems();

  return (
    <main className="min-h-screen w-full bg-[#100D0A] text-[#F8F5F2] overflow-x-hidden relative">
      {/* Componente cliente para limpiar sesión admin si existe */}
      <SessionGuard />

      {/* Barra de navegación pública */}
      <Navbar />

        <Hero />

      <ScrollReveal direction="up" delay={0.1}>
        <Highlights />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        {/* Recibe los items precalculados en el servidor */}
        <FeaturedSection items={menuItems} />
      </ScrollReveal>

      <div id="menu">
        <ScrollReveal direction="up" delay={0.1}>
          {/* Recibe los mismos items, eliminando su consulta SELECT interna */}
          <InteractiveMenu initialItems={menuItems} />
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.1}>
        <ReservationForm />
      </ScrollReveal>

      <FooterSection />

      {/* Widgets flotantes globales */}
      <WhatsAppWidget />
      <CookieBanner />
    </main>
  );
}