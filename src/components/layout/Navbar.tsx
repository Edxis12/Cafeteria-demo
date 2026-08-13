'use client';

import { useState, useEffect } from 'react';
import { Coffee, Clock, Menu as MenuIcon, X } from 'lucide-react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenNow, setIsOpenNow] = useState(false);

    // Lógica para verificar horario (Ejemplo: Abierto de 7:00 AM a 9:00 PM)
    useEffect(() => {
        const checkStatus = () => {
            const currentHour = new Date().getHours();
            // Abierto entre las 7 (7 AM) y las 21 (9 PM)
            setIsOpenNow(currentHour >= 7 && currentHour < 21);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Revisa cada minuto
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F8F5F2]/80 dark:bg-[#100D0A]/80 border-b border-black/5 dark:border-white/10">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo / Nombre del Negocio */}
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#1A120B] text-[#F8F5F2] dark:bg-[#F8F5F2] dark:text-[#1A120B]">
                        <Coffee size={20} />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-wide text-[#1A120B] dark:text-[#F8F5F2]">
                        VELVET <span className="text-[#D57E7E] font-sans text-xs uppercase tracking-widest block font-medium">Roasters</span>
                    </span>
                </div>

                {/* Status Badge + Enlaces Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Badge de Horario */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
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
                        <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <Clock size={12} />
                            {isOpenNow ? 'Abierto ahora • Cierra 9:00 PM' : 'Cerrado • Abre 7:00 AM'}
                        </span>
                    </div>

                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <a href="#menu" className="hover:text-[#D57E7E] transition-colors">Menú</a>
                        <a href="#nosotros" className="hover:text-[#D57E7E] transition-colors">Nosotros</a>
                        <a href="#contacto" className="hover:text-[#D57E7E] transition-colors">Contacto</a>
                    </nav>

                    <button className="px-4 py-2 text-xs font-semibold rounded-full bg-[#D57E7E] text-white hover:bg-[#c26d6d] transition-all shadow-sm">
                        Reservar Mesa
                    </button>
                </div>

                {/* Botón Menú Móvil */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-700 dark:text-gray-200"
                >
                    {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>

            {/* Menú Desplegable Móvil */}
            {isOpen && (
                <div className="md:hidden border-b border-black/5 dark:border-white/10 bg-[#F8F5F2] dark:bg-[#100D0A] px-4 py-4 space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 w-fit">
                        <span className={`h-2 w-2 rounded-full ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{isOpenNow ? 'Abierto ahora' : 'Cerrado actualmente'}</span>
                    </div>
                    <a href="#menu" className="block text-sm py-1 hover:text-[#D57E7E]">Menú</a>
                    <a href="#nosotros" className="block text-sm py-1 hover:text-[#D57E7E]">Nosotros</a>
                    <a href="#contacto" className="block text-sm py-1 hover:text-[#D57E7E]">Contacto</a>
                </div>
            )}
        </header>
    );
}