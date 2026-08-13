'use client';

import { Star, MapPin, Phone } from 'lucide-react';

const REVIEWS = [
    {
        id: 1,
        name: 'Carolina M.',
        role: 'Cliente Frecuente',
        comment: 'El Flat White es simplemente perfecto y los croissants recién horneados son de otro mundo. Mi lugar favorito para trabajar por las mañanas.',
        stars: 5,
    },
    {
        id: 2,
        name: 'Santi Villa',
        role: 'Crítico Gastronómico Local',
        comment: 'Atención impecable y una selección de granos de especialidad que pocos lugares en la ciudad logran ofrecer.',
        stars: 5,
    },
];

export function FooterSection() {
    return (
        <footer className="bg-[#181512] text-[#F8F5F2] border-t border-[#2D2620]">
            {/* Sección Testimonios */}
            <div id="nosotros" className="max-w-6xl mx-auto px-4 py-16 border-b border-[#2D2620]">
                <div className="text-center mb-12">
                    <span className="text-[#D57E7E] text-xs font-semibold tracking-widest uppercase">
                        Experiencias
                    </span>
                    <h2 className="text-3xl font-serif font-bold mt-1">Lo que dicen nuestros clientes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {REVIEWS.map((review) => (
                        <div
                            key={review.id}
                            className="p-6 rounded-2xl bg-[#100D0A] border border-[#2D2620] space-y-4"
                        >
                            <div className="flex gap-1 text-[#D57E7E]">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-sm text-[#A39B92] italic leading-relaxed">
                                "{review.comment}"
                            </p>
                            <div>
                                <p className="text-sm font-semibold">{review.name}</p>
                                <p className="text-xs text-[#A39B92]">{review.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info de contacto y Footer */}
            <div id="contacto" className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-[#A39B92]">
                <div className="space-y-3">
                    <h3 className="font-serif font-bold text-lg text-[#F8F5F2]">VELVET Roasters</h3>
                    <p className="text-xs leading-relaxed">
                        Apasionados por la cultura del café de origen y momentos memorables.
                    </p>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-[#F8F5F2]">Ubicación y Contacto</h4>
                    <p className="flex items-center gap-2 text-xs">
                        <MapPin size={14} className="text-[#D57E7E]" /> Av. Principal #102, Centro
                    </p>
                    <p className="flex items-center gap-2 text-xs">
                        <Phone size={14} className="text-[#D57E7E]" /> +52 (667) 000-0000
                    </p>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-[#F8F5F2]">Síguenos</h4>
                    <div className="flex gap-4">
                        {/* Instagram SVG */}
                        <a href="#" className="p-2 rounded-full bg-[#231F1B] hover:text-[#D57E7E] transition-colors" aria-label="Instagram">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        {/* Facebook SVG */}
                        <a href="#" className="p-2 rounded-full bg-[#231F1B] hover:text-[#D57E7E] transition-colors" aria-label="Facebook">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-[#A39B92] border-t border-[#2D2620]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>© {new Date().getFullYear()} VELVET Roasters. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <a href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
                    <a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
                </div>
            </div>
        </footer>
    );
}