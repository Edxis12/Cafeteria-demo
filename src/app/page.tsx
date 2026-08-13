import { Hero } from '@/src/components/home/Hero';
import { Highlights } from '@/src/components/home/HighLights';
import { InteractiveMenu } from '@/src/components/menu/InteractiveMenu';
import { ReservationForm } from '@/src/components/home/ReservationForm';
import { FooterSection } from '@/src/components/home/FooterSection';
import { ScrollReveal } from '@/src/components/shared/ScrollReveal';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F2] dark:bg-[#100D0A] text-[#1A120B] dark:text-[#F8F5F2] transition-colors overflow-hidden">
      {/* Hero anima al cargar la página */}
      <ScrollReveal direction="up">
        <Hero />
      </ScrollReveal>

      {/* Sección de Highlights y Marquee */}
      <ScrollReveal direction="up" delay={0.1}>
        <Highlights />
      </ScrollReveal>

      {/* Sección del Menú Interactivo */}
      <div id="menu">
        <ScrollReveal direction="up" delay={0.1}>
          <InteractiveMenu />
        </ScrollReveal>
      </div>

      {/* Formulario de Reservas */}
      <ScrollReveal direction="up" delay={0.1}>
        <ReservationForm />
      </ScrollReveal>

      {/* Pie de Página */}
      <FooterSection />
    </main>
  );
}