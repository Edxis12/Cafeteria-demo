'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Award, Star } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-16">
            {/* Fondo con Overlay Sutil */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1920"
                    alt="Café de especialidad siendo preparado"
                    className="w-full h-full object-cover object-center opacity-25 dark:opacity-20 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#F8F5F2]/80 via-[#F8F5F2]/60 to-[#F8F5F2] dark:from-[#100D0A]/80 dark:via-[#100D0A]/60 dark:to-[#100D0A]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

                {/* Badge superior */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-widest text-[#D57E7E]"
                >
                    <Award size={14} /> Café de Origen Seleccionado
                </motion.div>

                {/* Título Principal */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#1A120B] dark:text-[#F8F5F2] leading-[1.15]"
                >
                    El arte de la extracción <br className="hidden sm:block" />
                    <span className="italic text-[#D57E7E] font-normal">perfecta</span> en cada taza.
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-[#A39B92] font-normal leading-relaxed"
                >
                    Tostado artesanal, repostería recién horneada y un ambiente diseñado para los amantes de las experiencias inolvidables.
                </motion.p>

                {/* Botones de Acción (Call to Actions) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-4 pt-4"
                >
                    <a
                        href="#menu"
                        className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1A120B] text-[#F8F5F2] dark:bg-[#F8F5F2] dark:text-[#1A120B] font-semibold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                    >
                        Explorar Menú <ArrowRight size={16} />
                    </a>
                    <a
                        href="#reservas"
                        className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-semibold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                    >
                        Reservar Experiencia
                    </a>
                </motion.div>

                {/* Indicadores de Valor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-black/5 dark:border-white/10 text-xs sm:text-sm font-medium text-gray-600 dark:text-[#A39B92]"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Coffee size={18} className="text-[#D57E7E]" />
                        <span>Granos 100% Arábica</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Star size={18} className="text-[#D57E7E]" />
                        <span>Calificación 4.9 / 5.0</span>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Baristas Certificados</span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}