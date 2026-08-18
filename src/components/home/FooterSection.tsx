'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    Star,
    MapPin,
    Phone,
    Quote,
    Sparkles,
    Coffee,
    Lock,
    MessageSquarePlus,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

// Carga diferida del modal de reseña (no pesa en el bundle inicial)
const DynamicReviewModal = dynamic(
    () => import('./ReviewModal').then((mod) => mod.ReviewModal),
    { ssr: false }
);

interface Review {
    id: string;
    name: string;
    role: string;
    comment: string;
    stars: number;
    avatar: string;
}

export function FooterSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadReviews() {
            try {
                const res = await fetch('/api/reviews');
                if (!res.ok) return;
                const result = await res.json();
                if (result.data) {
                    setReviews(result.data);
                } else if (Array.isArray(result)) {
                    setReviews(result);
                }
            } catch {
                // Fallback silencioso en caso de error de red
            }
        }

        loadReviews();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth > 640 ? 400 : 300;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <footer className="relative bg-[#100D0A] text-[#F8F5F2] border-t border-[#2D2620] overflow-hidden">
            {/* Halo ambiental */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[600px] h-[200px] sm:h-[300px] bg-[#D57E7E]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

            {/* Sección Testimonios */}
            <div
                id="nosotros"
                className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-b border-[#2D2620]"
            >
                <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-3 sm:gap-4">
                    <span className="inline-flex items-center gap-1.5 text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
                        <Sparkles size={13} className="shrink-0" /> Experiencias Reales
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] leading-tight">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed px-2">
                        Historias y opiniones de quienes han hecho de Velvet su ritual de todos los días.
                    </p>

                    {/* Botón para abrir el Modal de Reseña */}
                    <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181512] border border-[#D57E7E]/30 text-xs font-bold uppercase tracking-wider text-[#D57E7E] hover:bg-[#D57E7E] hover:text-white transition-all shadow-lg shadow-black/40 cursor-pointer"
                    >
                        <MessageSquarePlus size={14} />
                        <span>Dejar mi reseña</span>
                    </button>
                </div>

                {/* Carrusel Deslizable */}
                <div className="relative">
                    {reviews.length > 1 && (
                        <div className="hidden sm:flex justify-end gap-2 mb-4">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2.5 rounded-full bg-[#181512] border border-[#2D2620] text-[#A39B92] hover:text-white hover:border-[#D57E7E]/40 transition-colors cursor-pointer"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2.5 rounded-full bg-[#181512] border border-[#2D2620] text-[#A39B92] hover:text-white hover:border-[#D57E7E]/40 transition-colors cursor-pointer"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    <div
                        ref={sliderRef}
                        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 scrollbar-none scroll-smooth"
                    >
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="snap-center sm:snap-start shrink-0 w-[85vw] sm:w-[380px] lg:w-[400px] relative p-5 sm:p-7 rounded-3xl bg-[#181512]/80 border border-white/10 backdrop-blur-xl hover:border-[#D57E7E]/40 transition-colors flex flex-col justify-between space-y-4 shadow-xl select-none"
                            >
                                <Quote
                                    className="absolute top-5 right-5 sm:top-6 sm:right-6 text-white/5 pointer-events-none"
                                    size={38}
                                />

                                <div className="space-y-3">
                                    <div className="flex gap-1 text-orange-400">
                                        {[...Array(review.stars || 5)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                    </div>

                                    <p className="text-xs sm:text-sm text-[#C5BCB3] italic leading-relaxed line-clamp-4">
                                        &quot;{review.comment}&quot;
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-3.5 border-t border-white/5">
                                    <div className="w-9 h-9 rounded-full bg-[#231F1B] border border-[#2D2620] text-[#D57E7E] flex items-center justify-center font-serif font-bold text-xs shrink-0">
                                        {review.avatar || 'CL'}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-serif font-bold text-[#F8F5F2] truncate">
                                            {review.name}
                                        </p>
                                        <p className="text-[10px] text-[#A39B92] truncate">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info de contacto y Navegación */}
            <div
                id="contacto"
                className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs text-[#A39B92]"
            >
                <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#231F1B] text-[#D57E7E] border border-[#2D2620]">
                            <Coffee size={18} />
                        </div>
                        <span className="font-serif font-bold text-lg text-[#F8F5F2]">VELVET Roasters</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#A39B92] max-w-sm">
                        Apasionados por la cultura del café de origen, el tueste artesanal y los momentos memorables.
                    </p>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#F8F5F2]">Navegación</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#D57E7E] transition-colors py-1 inline-block">Inicio</a></li>
                        <li><a href="#menu" className="hover:text-[#D57E7E] transition-colors py-1 inline-block">Menú Especializado</a></li>
                        <li><a href="#nosotros" className="hover:text-[#D57E7E] transition-colors py-1 inline-block">Experiencias</a></li>
                        <li><a href="#reservas" className="hover:text-[#D57E7E] transition-colors py-1 inline-block">Reservar Mesa</a></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#F8F5F2]">Visítanos</h4>
                    <p className="flex items-start gap-2 leading-relaxed">
                        <MapPin size={15} className="text-[#D57E7E] shrink-0 mt-0.5" />
                        <span>Av. Principal #102, Centro</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone size={15} className="text-[#D57E7E] shrink-0" />
                        <span>+52 (667) 000-0000</span>
                    </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#F8F5F2]">Panel Privado</h4>
                    <a
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs text-[#A39B92] hover:text-[#D57E7E] transition-colors py-2 px-3 rounded-xl bg-[#181512] border border-[#2D2620]"
                    >
                        <Lock size={13} /> Acceso Administrativo
                    </a>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[11px] text-[#A39B92] border-t border-[#2D2620] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
                <p>© 2026 VELVET Roasters. Todos los derechos reservados.</p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <a href="/privacidad" className="hover:text-white transition-colors py-1">Política de Privacidad</a>
                    <a href="/terminos" className="hover:text-white transition-colors py-1">Términos y Condiciones</a>
                </div>
            </div>

            {/* Modal montado bajo demanda */}
            <DynamicReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
            />
        </footer>
    );
}