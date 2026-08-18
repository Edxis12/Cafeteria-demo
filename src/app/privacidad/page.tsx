import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#100D0A] text-[#F8F5F2] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Halo ambiental suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[250px] bg-[#D57E7E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Botón Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181512] border border-[#2D2620] text-xs font-semibold text-[#A39B92] hover:text-white hover:border-[#D57E7E]/40 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al Inicio</span>
        </Link>

        {/* Encabezado */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D57E7E]/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D57E7E] border border-[#D57E7E]/20">
            <ShieldCheck size={12} />
            <span>Seguridad & Confidencialidad</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed">
            Última actualización: 2026. Conoce cómo gestionamos y protegemos tus datos personales durante el proceso de reserva.
          </p>
        </div>

        {/* Contenido en bloque estructurado */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-6 text-xs sm:text-sm text-[#C5BCB3] leading-relaxed">
          <p>
            En <span className="text-white font-bold font-serif">VELVET Roasters</span> nos tomamos con absoluta seriedad la protección y el manejo ético de tus datos personales.
          </p>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">1</span>
              Información que Recopilamos
            </h2>
            <p className="text-xs text-[#A39B92] pl-8">
              A través del formulario de reserva, solicitamos únicamente tu nombre, correo electrónico y número telefónico. Esta información se utiliza exclusivamente para coordinar y confirmar la disponibilidad de tu mesa.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">2</span>
              Uso y Protección de la Información
            </h2>
            <p className="text-xs text-[#A39B92] pl-8">
              Tus datos son almacenados en bases de datos con cifrado de nivel empresarial. No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales o publicitarios.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">3</span>
              Comunicaciones Directas
            </h2>
            <p className="text-xs text-[#A39B92] pl-8">
              Solo recibirás notificaciones relacionadas con el estado de tu reserva (confirmación por correo electrónico o contacto directo vía WhatsApp para validación de asistencia).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}