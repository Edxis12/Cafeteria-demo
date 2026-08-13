'use client';

import { motion } from 'framer-motion';
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
        <section className="py-12 overflow-hidden bg-[#181512] text-[#F8F5F2] border-y border-[#2D2620]">
            {/* 1. Cinta de Marquesina Infinita (Marquee) */}
            <div className="relative flex whitespace-nowrap overflow-hidden py-3 bg-[#231F1B] border-y border-[#2D2620]/60 mb-16 select-none">
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
                    className="flex items-center gap-8 text-xs font-bold tracking-[0.2em] text-[#D57E7E] uppercase"
                >
                    {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, idx) => (
                        <div key={idx} className="flex items-center gap-8">
                            <span>{word}</span>
                            <span className="text-gray-600">•</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 2. Grid de Diferenciadores / Valor Agregado */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <span className="text-[#D57E7E] text-xs font-semibold tracking-widest uppercase">
                        La Experiencia Velvet
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-[#F8F5F2]">
                        Diseñado para Momentos Memorables
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {HIGHLIGHTS.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-[#100D0A] border border-[#2D2620] space-y-3 group hover:border-[#D57E7E]/40 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#231F1B] text-[#D57E7E] flex items-center justify-center group-hover:bg-[#D57E7E] group-hover:text-white transition-colors">
                                    <Icon size={22} />
                                </div>
                                <h3 className="font-bold text-base text-[#F8F5F2]">{item.title}</h3>
                                <p className="text-xs text-[#A39B92] leading-relaxed">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}