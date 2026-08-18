'use client';

import { useState, useEffect } from 'react';
import { Coffee, Clock, Menu as MenuIcon, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenNow, setIsOpenNow] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const currentHour = new Date().getHours();
            setIsOpenNow(currentHour >= 7 && currentHour < 21);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full px-3 sm:px-4 pt-3 sm:pt-4 pb-2 transition-all">
            <div className="max-w-6xl mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between rounded-full bg-[#100D0A]/80 backdrop-blur-xl border border-[#2D2620] shadow-xl shadow-black/40">

                {/* 1. Logo con Identidad de Marca */}
                <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
                    <div className="p-2 rounded-xl bg-[#231F1B] text-[#D57E7E] group-hover:bg-[#D57E7E] group-hover:text-white transition-colors border border-[#2D2620]">
                        <Coffee size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif font-bold text-base sm:text-lg leading-tight text-[#F8F5F2] tracking-wide">
                            VELVET
                        </span>
                        <span className="text-[#D57E7E] text-[8px] sm:text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.25em] font-sans font-bold -mt-0.5">
                            Roasters
                        </span>
                    </div>
                </a>

                {/* 2. Badge de Horario + Enlaces Desktop */}
                <div className="hidden md:flex items-center gap-5 lg:gap-6">
                    {/* Badge de Horario Integrado */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-[#181512] border border-[#2D2620]">
                        <span className="relative flex h-2 w-2">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'
                                    }`}
                            />
                            <span
                                className={`relative inline-flex rounded-full h-2 w-2 ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                            />
                        </span>
                        <span className="text-[#C5BCB3] flex items-center gap-1.5 font-sans">
                            <Clock size={12} className="text-[#D57E7E]" />
                            {isOpenNow ? 'Abierto • Cierra 9:00 PM' : 'Cerrado • Abre 7:00 AM'}
                        </span>
                    </div>

                    {/* Menú de Navegación */}
                    <nav className="flex items-center gap-5 lg:gap-6 text-xs uppercase tracking-widest font-semibold text-[#C5BCB3]">
                        <a href="#menu" className="hover:text-[#D57E7E] transition-colors py-1">
                            Menú
                        </a>
                        <a href="#nosotros" className="hover:text-[#D57E7E] transition-colors py-1">
                            Nosotros
                        </a>
                        <a href="#contacto" className="hover:text-[#D57E7E] transition-colors py-1">
                            Contacto
                        </a>
                    </nav>

                    {/* Botón Destacado */}
                    <a
                        href="#reservas"
                        className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#D57E7E] text-white hover:bg-[#c26d6d] transition-all shadow-md shadow-[#D57E7E]/20 hover:scale-105 active:scale-95 cursor-pointer min-h-[40px]"
                    >
                        <Sparkles size={13} />
                        <span>Reservar Mesa</span>
                    </a>
                </div>

                {/* 3. Botón Menú Móvil */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-full bg-[#181512] border border-[#2D2620] text-[#F8F5F2] hover:text-[#D57E7E] transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label="Abrir menú"
                >
                    {isOpen ? <X size={18} /> : <MenuIcon size={18} />}
                </button>
            </div>

            {/* 4. Menú Desplegable Móvil */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden max-w-6xl mx-auto mt-2 p-4 sm:p-5 rounded-3xl bg-[#181512]/95 backdrop-blur-2xl border border-[#2D2620] shadow-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-[#2D2620] pb-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#100D0A] border border-[#2D2620]">
                                <span
                                    className={`h-2 w-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                        }`}
                                />
                                <span className="text-xs text-[#C5BCB3]">
                                    {isOpenNow ? 'Abierto ahora (Cierra 9:00 PM)' : 'Cerrado (Abre 7:00 AM)'}
                                </span>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#C5BCB3]">
                            <a
                                href="#menu"
                                onClick={() => setIsOpen(false)}
                                className="py-2.5 px-3 rounded-xl hover:bg-[#231F1B] hover:text-white transition-colors"
                            >
                                Menú Especializado
                            </a>
                            <a
                                href="#nosotros"
                                onClick={() => setIsOpen(false)}
                                className="py-2.5 px-3 rounded-xl hover:bg-[#231F1B] hover:text-white transition-colors"
                            >
                                Nosotros & Testimonios
                            </a>
                            <a
                                href="#contacto"
                                onClick={() => setIsOpen(false)}
                                className="py-2.5 px-3 rounded-xl hover:bg-[#231F1B] hover:text-white transition-colors"
                            >
                                Contacto & Ubicación
                            </a>
                        </nav>

                        <a
                            href="#reservas"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#D57E7E] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D57E7E]/20 hover:bg-[#c26d6d] transition-all min-h-[44px]"
                        >
                            <Sparkles size={14} />
                            <span>Reservar Mesa</span>
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}