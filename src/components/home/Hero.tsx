'use client';

import Image from 'next/image';
import { ArrowRight, Coffee, Award, Star, Sparkles } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            {/* Fondo con Image de Next.js */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <Image
                    src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1920"
                    alt="Café de especialidad siendo preparado"
                    fill
                    priority
                    sizes="100vw"
                    quality={75}
                    className="object-cover object-center opacity-35 sm:opacity-40 scale-105 filter blur-[1px]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-[#D57E7E]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#100D0A]/85 via-[#100D0A]/70 to-[#100D0A]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 w-full">
                {/* Badge superior */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#D57E7E]/15 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#D57E7E] border border-[#D57E7E]/25 backdrop-blur-md shadow-sm">
                        <Award size={14} className="text-[#D57E7E] shrink-0" />
                        <span>Café de Origen Seleccionado</span>
                    </div>
                </div>

                {/* Título Principal */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F8F5F2] leading-[1.18] sm:leading-[1.1] tracking-tight px-1">
                    El arte de la extracción <br className="hidden sm:block" />
                    <span className="italic font-normal text-[#D57E7E] relative inline-block">
                        perfecta
                        <span className="absolute left-0 bottom-1 w-full h-[2px] sm:h-[3px] bg-[#D57E7E]/30 rounded-full" />
                    </span>{' '}
                    en cada taza.
                </h1>

                {/* Subtítulo */}
                <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-[#C5BCB3] font-normal leading-relaxed px-2 sm:px-4">
                    Tostado artesanal, repostería recién horneada y un ambiente diseñado para los amantes de las experiencias inolvidables.
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-xs sm:max-w-none mx-auto">
                    <a
                        href="#menu"
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-all shadow-xl shadow-[#D57E7E]/20 hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
                    >
                        <span>Explorar Menú</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="#reservas"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#181512] border border-[#2D2620] hover:border-[#D57E7E]/60 font-bold text-xs uppercase tracking-wider text-[#F8F5F2] hover:bg-[#D57E7E]/10 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
                    >
                        <Sparkles size={15} className="text-[#D57E7E]" />
                        <span>Reservar Experiencia</span>
                    </a>
                </div>

                {/* Indicadores de Valor */}
                <div className="pt-6 sm:pt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto border-t border-[#2D2620]">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#181512]/60 border border-[#2D2620] backdrop-blur-md flex items-center justify-center gap-3 text-xs font-semibold text-[#C5BCB3] hover:border-[#D57E7E]/30 transition-colors">
                        <div className="p-2 rounded-xl bg-[#D57E7E]/10 text-[#D57E7E] shrink-0">
                            <Coffee size={16} />
                        </div>
                        <span>Granos 100% Arábica</span>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#181512]/60 border border-[#2D2620] backdrop-blur-md flex items-center justify-center gap-3 text-xs font-semibold text-[#C5BCB3] hover:border-[#D57E7E]/30 transition-colors">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                            <Star size={16} />
                        </div>
                        <span>Calificación 4.9 / 5.0</span>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#181512]/60 border border-[#2D2620] backdrop-blur-md flex items-center justify-center gap-3 text-xs font-semibold text-[#C5BCB3] hover:border-[#D57E7E]/30 transition-colors">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <span>Baristas Certificados</span>
                    </div>
                </div>
            </div>
        </section>
    );
}