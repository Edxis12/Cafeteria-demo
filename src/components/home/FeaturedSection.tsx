'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, ArrowRight, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface MenuItem {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    is_featured?: boolean;
    featured_order?: number;
    is_seasonal?: boolean;
    badge?: string;
}

interface FeaturedSectionProps {
    items: MenuItem[];
}

function unescapeHtml(text: string): string {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x60;/g, '`');
}

const DEFAULT_IMAGE =
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600';

export function FeaturedSection({ items = [] }: FeaturedSectionProps) {
    // Derivamos los destacados y de temporada en memoria (0 llamadas de red)
    const featuredItems = useMemo(() => {
        return items
            .filter((i) => i.is_featured)
            .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
            .slice(0, 3);
    }, [items]);

    const seasonalItems = useMemo(() => {
        return items.filter((i) => i.is_seasonal);
    }, [items]);

    const [currentSeasonalIndex, setCurrentSeasonalIndex] = useState(0);

    // Rotación automática cada 6 segundos
    useEffect(() => {
        if (seasonalItems.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSeasonalIndex((prev) => (prev + 1) % seasonalItems.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [seasonalItems.length]);

    const nextSeasonal = () => {
        setCurrentSeasonalIndex((prev) => (prev + 1) % seasonalItems.length);
    };

    const prevSeasonal = () => {
        setCurrentSeasonalIndex((prev) => (prev - 1 + seasonalItems.length) % seasonalItems.length);
    };

    const currentSeasonProduct = seasonalItems[currentSeasonalIndex];

    if (featuredItems.length === 0 && seasonalItems.length === 0) {
        return null;
    }

    return (
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
            {/* Halo ambiental suave */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] sm:w-[600px] h-[250px] sm:h-[400px] bg-[#D57E7E]/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

            {/* BLOQUE 1: FAVORITOS DE LA CASA */}
            {featuredItems.length > 0 && (
                <div className="relative z-10 space-y-8 sm:space-y-12">
                    <div className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
                        <span className="inline-flex items-center gap-1.5 text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
                            <Flame size={14} className="text-orange-400 shrink-0" /> Lo Más Pedido
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] tracking-tight">
                            Favoritos de la Casa
                        </h2>
                        <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed px-2">
                            Las preparaciones insignia que nuestros comensales eligen una y otra vez.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {featuredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="group relative p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] hover:border-[#D57E7E]/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:shadow-[#D57E7E]/10"
                            >
                                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-black">
                                    <img
                                        src={item.image_url || DEFAULT_IMAGE}
                                        alt={unescapeHtml(item.title)}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#D57E7E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                        <Star size={11} className="fill-current text-orange-400 shrink-0" />{' '}
                                        {unescapeHtml(item.badge || 'Más Vendido')}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[10px] uppercase tracking-widest text-[#A39B92] font-semibold">
                                        {item.category === 'cafes'
                                            ? 'Café de Especialidad'
                                            : item.category === 'postres'
                                                ? 'Repostería'
                                                : 'Especialidad'}
                                    </span>
                                    <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-[#D57E7E] transition-colors">
                                        {unescapeHtml(item.title)}
                                    </h3>
                                    <p className="text-xs text-[#A39B92] leading-relaxed line-clamp-2">
                                        {unescapeHtml(item.description)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-[#2D2620]">
                                    <span className="font-bold text-xs sm:text-sm text-[#D57E7E] bg-[#D57E7E]/10 px-2.5 sm:px-3 py-1 rounded-full border border-[#D57E7E]/20">
                                        ${Number(item.price || 0).toFixed(2)} MXN
                                    </span>
                                    <a
                                        href="#reservas"
                                        className="text-xs font-semibold text-white group-hover:text-[#D57E7E] transition-colors flex items-center gap-1 py-1"
                                    >
                                        Pedir en mesa <ArrowRight size={13} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* BLOQUE 2: LANZAMIENTO DE TEMPORADA */}
            {seasonalItems.length > 0 && currentSeasonProduct && (
                <div className="relative z-10">
                    <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-[#14110E] border border-[#2D2620] overflow-hidden shadow-2xl shadow-black/80">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSeasonProduct.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] sm:min-h-[460px]"
                            >
                                {/* Información */}
                                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between space-y-6 order-2 lg:order-1">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D57E7E] uppercase tracking-widest bg-[#D57E7E]/10 px-3 py-1 rounded-full border border-[#D57E7E]/20">
                                                <Sparkles size={12} className="shrink-0" /> Edición Limitada de Temporada
                                            </span>
                                            <span className="text-[11px] text-[#A39B92] flex items-center gap-1 font-medium">
                                                <Clock size={12} className="shrink-0" /> Solo por tiempo limitado
                                            </span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-white leading-tight">
                                            {unescapeHtml(currentSeasonProduct.title)}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-[#C5BCB3] leading-relaxed max-w-lg">
                                            {unescapeHtml(currentSeasonProduct.description)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2D2620]">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-[#A39B92] block">
                                                Precio Especial
                                            </span>
                                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#D57E7E]">
                                                ${Number(currentSeasonProduct.price || 0).toFixed(2)} MXN
                                            </span>
                                        </div>

                                        <a
                                            href="#reservas"
                                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-all shadow-lg shadow-[#D57E7E]/20 hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
                                        >
                                            <span>Reservar para probar</span>
                                            <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>

                                {/* Imagen */}
                                <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-auto min-h-[220px] overflow-hidden bg-black order-1 lg:order-2">
                                    <img
                                        src={currentSeasonProduct.image_url || DEFAULT_IMAGE}
                                        alt={unescapeHtml(currentSeasonProduct.title)}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                                        }}
                                        className="w-full h-full object-cover object-center scale-105 filter contrast-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#14110E] via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controles de Navegación */}
                        {seasonalItems.length > 1 && (
                            <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                                <button
                                    onClick={prevSeasonal}
                                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                                    title="Anterior"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex gap-1.5 px-1.5">
                                    {seasonalItems.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSeasonalIndex(i)}
                                            className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSeasonalIndex === i ? 'w-4 sm:w-5 bg-[#D57E7E]' : 'w-1.5 bg-white/30'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={nextSeasonal}
                                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                                    title="Siguiente"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}