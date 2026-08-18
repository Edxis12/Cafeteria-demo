'use client';

import { Coffee, Croissant, Wifi, Dog } from 'lucide-react';

const HIGHLIGHTS = [
    {
        icon: Coffee,
        title: 'Granos de Especialidad',
        description: 'Selección 100% Arábica con tueste artesanal proveniente de Chiapas y Oaxaca.',
    },
    {
        icon: Croissant,
        title: 'Horno Artesanal',
        description: 'Repostería y pan de hojaldre horneado diariamente desde las 7:00 AM.',
    },
    {
        icon: Wifi,
        title: 'Espacio Co-Working',
        description: 'Wi-Fi de alta velocidad, ambiente tranquilo y contactos en cada mesa.',
    },
    {
        icon: Dog,
        title: 'Terraza Pet-Friendly',
        description: 'Espacio al aire libre acondicionado cómodamente para ti y tu mascota.',
    },
];

const MARQUEE_WORDS = [
    'CAFÉ DE ORIGEN',
    'TUESTE ARTESANAL',
    'REPOSTERÍA DE AUTOR',
    'ESPACIO PET FRIENDLY',
    'BARRA DE FILTRADOS',
    'AMBIENTE ACOGEDOR',
];

export function Highlights() {
    return (
        <section className="relative py-12 sm:py-16 overflow-hidden bg-[#100D0A] text-[#F8F5F2]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[180px] bg-[#D57E7E]/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Marquesina con animación CSS fluida */}
            <div className="relative flex whitespace-nowrap overflow-hidden py-2.5 sm:py-3 bg-[#181512] border-y border-[#2D2620] mb-12 sm:mb-16 select-none">
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#100D0A] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#100D0A] to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-marquee items-center text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D57E7E] uppercase transform-gpu will-change-transform">
                    {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, idx) => (
                        <div key={`m1-${idx}`} className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
                            <span>{word}</span>
                            <span className="text-[#2D2620]">•</span>
                        </div>
                    ))}
                    {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, idx) => (
                        <div key={`m2-${idx}`} className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
                            <span>{word}</span>
                            <span className="text-[#2D2620]">•</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid de Diferenciadores */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center gap-3">
                    <span className="inline-block text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
                        La Experiencia Velvet
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] leading-tight">
                        Diseñado para Momentos <br className="hidden sm:block" /> Memorables
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {HIGHLIGHTS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="group relative p-5 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] hover:border-[#D57E7E]/40 hover:-translate-y-1 transition-all duration-200 space-y-3 sm:space-y-4 shadow-xl"
                            >
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#231F1B] text-[#D57E7E] flex items-center justify-center group-hover:bg-[#D57E7E] group-hover:text-white transition-colors duration-200 shadow-inner">
                                    <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                                </div>
                                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F8F5F2] group-hover:text-[#D57E7E] transition-colors duration-200">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-[#A39B92] leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}