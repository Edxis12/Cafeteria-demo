'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

export function WhatsAppWidget() {
  // Ajusta tu número de WhatsApp aquí (con código de país)
  const phoneNumber = '526671234567';
  const defaultMessage = encodeURIComponent(
    '¡Hola VELVET Roasters! ☕ Me gustaría obtener más información sobre su menú y reservas.'
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-full bg-[#181512]/90 backdrop-blur-xl border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 hover:border-emerald-400 transition-all duration-300 min-w-[48px] min-h-[48px]"
        aria-label="Contactar por WhatsApp"
      >
        {/* Halo luminoso suave de fondo */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

        {/* Icono con badge de actividad */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-black shadow-md shrink-0">
          <MessageSquare size={16} className="fill-current" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#181512] animate-pulse" />
        </div>

        {/* Texto del Botón (Visible en sm:) */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles size={9} /> ¿Dudas rápidas?
          </span>
          <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
            Escríbenos por WhatsApp
          </span>
        </div>
      </motion.a>
    </div>
  );
}