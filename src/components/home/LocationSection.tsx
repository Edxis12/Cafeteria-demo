'use client';

import { motion } from 'framer-motion';
import {
    MapPin,
    Clock,
    Navigation,
    Compass,
    Sparkles,
    Car,
    ExternalLink,
} from 'lucide-react';

export function LocationSection() {
    const googleMapsUrl =
        'https://www.google.com/maps/search/?api=1&query=VELVET+CAFE+%26+BISTRO+Av+Gobernador+Balarezo+Davila+Tijuana+BC';

    return (
        <section
            id="ubicacion"
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        >
            {/* Halo ambiental suave */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] bg-[#D57E7E]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 space-y-10 sm:space-y-12">
                {/* Encabezado */}
                <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-3 sm:gap-4">
                    <span className="inline-flex items-center gap-1.5 text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
                        <Compass size={13} className="shrink-0" /> Encuéntranos
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] leading-tight">
                        Nuestra Ubicación
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed">
                        Visítanos en la zona de Col. Madero (Cacho). Un espacio diseñado para
                        disfrutar del mejor café de especialidad y gastronomía bistro.
                    </p>
                </div>

                {/* Contenedor Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                    {/* Columna Izquierda: Información */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-5 flex flex-col justify-between space-y-4"
                    >
                        {/* Tarjeta Dirección */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] shadow-xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-[#231F1B] text-[#D57E7E] border border-[#2D2620] shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                                        Dirección
                                    </h4>
                                    <p className="text-xs text-[#A39B92] leading-relaxed">
                                        Av. Gobernador Balarezo, Dávila, 22044 Tijuana, B.C.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Horarios */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] shadow-xl space-y-3.5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-[#231F1B] text-[#D57E7E] border border-[#2D2620] shrink-0">
                                    <Clock size={18} />
                                </div>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                                    Horarios de Atención
                                </h4>
                            </div>

                            <div className="space-y-2 text-xs divide-y divide-white/5 pt-1">
                                <div className="flex justify-between items-center pt-1.5">
                                    <span className="text-[#A39B92]">Lunes a Jueves</span>
                                    <span className="text-white font-semibold">
                                        01:00 PM – 10:00 PM
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[#A39B92]">Viernes a Domingo</span>
                                    <span className="text-[#D57E7E] font-semibold">
                                        01:00 PM – 11:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Servicios */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] shadow-xl space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center gap-2 text-[#C5BCB3]">
                                    <Car size={15} className="text-[#D57E7E] shrink-0" />
                                    <span>Consumo en el lugar</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#C5BCB3]">
                                    <Navigation size={15} className="text-[#D57E7E] shrink-0" />
                                    <span>Pedidos desde auto</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#C5BCB3]">
                                    <Sparkles size={15} className="text-[#D57E7E] shrink-0" />
                                    <span>Café de Especialidad</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#C5BCB3]">
                                    <Compass size={15} className="text-[#D57E7E] shrink-0" />
                                    <span>Zona Cacho / Dávila</span>
                                </div>
                            </div>
                        </div>

                        {/* Botón Abrir en Google Maps */}
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 px-6 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D57E7E]/20 cursor-pointer min-h-[46px]"
                        >
                            <span>Abrir en Google Maps</span>
                            <ExternalLink size={15} />
                        </a>
                    </motion.div>

                    {/* Columna Derecha: Mapa Embebido con Pin Exacto */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 min-h-[350px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-[#2D2620] shadow-2xl relative bg-[#14110E]"
                    >
                        <iframe
                            title="Ubicación de VELVET CAFE & BISTRO"
                            src="https://maps.google.com/maps?q=VELVET+CAFE+%26+BISTRO,+Av+Gobernador+Balarezo,+Davila,+Tijuana,+B.C.&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{
                                border: 0,
                                minHeight: '100%',
                                filter: 'invert(90%) hue-rotate(180deg) contrast(95%) brightness(90%)',
                            }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full min-h-[350px] sm:min-h-[420px]"
                        />

                        {/* Badge flotante */}
                        <div className="absolute top-4 left-4 bg-[#14110E]/90 backdrop-blur-md border border-[#2D2620] px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-xl pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-[11px] font-bold text-white font-serif">
                                VELVET CAFE & BISTRO
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}