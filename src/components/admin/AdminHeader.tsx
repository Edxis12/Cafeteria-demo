'use client';

import { useEffect, useState } from 'react';
import { Coffee, Bell, BellRing, RefreshCw, LogOut, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminHeaderProps {
    notificationsEnabled: boolean;
    toggleNotifications: () => void;
    loading: boolean;
    onRefresh: () => void;
    onLogout: () => void;
    newArrivalAlert: string | null;
}

export function AdminHeader({
    notificationsEnabled,
    toggleNotifications,
    loading,
    onRefresh,
    onLogout,
    newArrivalAlert,
}: AdminHeaderProps) {
    // Estado local para aislar el ciclo de vida del toast
    const [currentAlert, setCurrentAlert] = useState<string | null>(null);

    useEffect(() => {
        if (!newArrivalAlert) return;
        setCurrentAlert(newArrivalAlert);

        const timer = setTimeout(() => {
            setCurrentAlert(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [newArrivalAlert]);

    return (
        <>
            <AnimatePresence>
                {currentAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-emerald-500 text-black px-4 sm:px-6 py-2.5 rounded-full font-bold text-xs shadow-2xl flex items-center justify-center gap-2"
                    >
                        <BellRing size={15} className="shrink-0 animate-bounce" />
                        <span className="truncate">¡{currentAlert}!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="sticky top-0 z-40 w-full bg-[#14110E]/85 backdrop-blur-xl border-b border-[#2D2620] px-3 sm:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#231F1B] text-[#D57E7E] border border-[#2D2620] shrink-0">
                            <Coffee size={17} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-serif font-bold text-sm sm:text-base text-white">VELVET</span>
                                <span className="text-[9px] font-bold text-[#D57E7E] uppercase bg-[#D57E7E]/10 px-2 py-0.5 rounded-full border border-[#D57E7E]/20">
                                    Panel
                                </span>
                            </div>
                            <p className="text-[10px] text-[#A39B92] hidden md:block">Control de Reservas & Catálogo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                        <button
                            onClick={toggleNotifications}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${notificationsEnabled
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-[#181512] text-[#A39B92] border-[#2D2620] hover:text-white hover:bg-[#231F1B]'
                                }`}
                        >
                            {notificationsEnabled ? <BellRing size={13} /> : <Bell size={13} />}
                            <span className="hidden sm:inline">
                                {notificationsEnabled ? 'Alertas Activas' : 'Activar Alertas'}
                            </span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181512] hover:bg-[#231F1B] text-[#A39B92] hover:text-white text-xs font-semibold border border-[#2D2620] transition-colors min-h-[36px]"
                        >
                            <span>Ver Tienda</span>
                            <ArrowUpRight size={13} />
                        </a>

                        <button
                            onClick={onRefresh}
                            className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#181512] hover:bg-[#231F1B] text-xs font-semibold border border-[#2D2620] text-[#C5BCB3] cursor-pointer transition-colors min-h-[36px]"
                            title="Actualizar datos"
                        >
                            <RefreshCw size={13} className={loading ? 'animate-spin text-[#D57E7E]' : ''} />
                            <span className="hidden sm:inline ml-1.5">Actualizar</span>
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center justify-center p-2 sm:px-3.5 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 cursor-pointer transition-all min-h-[36px]"
                            title="Cerrar sesión"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline ml-1.5">Salir</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}