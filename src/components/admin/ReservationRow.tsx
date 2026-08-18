'use client';

import React from 'react';
import {
    Mail,
    Phone,
    Users,
    Calendar,
    Clock,
    MessageSquare,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Reservation } from './ReservationTab';

interface ReservationRowProps {
    reservation: Reservation;
    updateStatus: (id: string, status: string) => void;
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

export const ReservationRow = React.memo(function ReservationRow({
    reservation: res,
    updateStatus,
}: ReservationRowProps) {
    const getWhatsAppLink = (item: Reservation) => {
        const rawDigits = item.phone.replace(/\D/g, '');
        const phoneWithCountry = rawDigits.length === 10 ? `52${rawDigits}` : rawDigits;
        const cleanName = unescapeHtml(item.name);
        const cleanZone = unescapeHtml(item.zone || 'Salón Principal');

        const text = encodeURIComponent(
            `Hola ${cleanName}, te saludamos de VELVET Roasters. Te escribimos para confirmar tu reserva en el área "${cleanZone}" programada para el día ${item.reservation_date} a las ${item.reservation_time}. ¿Nos confirmas tu asistencia?`
        );
        return `https://wa.me/${phoneWithCountry}?text=${text}`;
    };

    return (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] hover:border-white/10 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 shadow-xl">
            <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                        {unescapeHtml(res.name)}
                    </h3>
                    <span
                        className={`text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${res.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : res.status === 'cancelled'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}
                    >
                        {res.status === 'confirmed'
                            ? 'Confirmada'
                            : res.status === 'cancelled'
                                ? 'Cancelada'
                                : 'Pendiente'}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs text-[#A39B92]">
                    <span className="flex items-center gap-1.5">
                        <Mail size={13} /> {res.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Phone size={13} /> {res.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Users size={13} /> {res.guests} personas
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {res.reservation_date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={13} /> {res.reservation_time}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#1C1814] text-[#D57E7E] font-medium border border-[#2D2620]">
                        Zona: {unescapeHtml(res.zone || 'Salón Principal')}
                    </span>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center gap-2 w-full sm:w-auto self-stretch lg:self-auto justify-end flex-wrap pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0 shrink-0">
                <a
                    href={getWhatsAppLink(res)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20 transition-colors min-h-[38px]"
                >
                    <MessageSquare size={14} /> WhatsApp
                </a>

                {res.status !== 'confirmed' && (
                    <button
                        onClick={() => updateStatus(res.id, 'confirmed')}
                        className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-white/5 text-white hover:bg-emerald-500/20 hover:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer min-h-[38px]"
                    >
                        <CheckCircle size={14} /> Confirmar
                    </button>
                )}

                {res.status !== 'cancelled' && (
                    <button
                        onClick={() => updateStatus(res.id, 'cancelled')}
                        className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-rose-500/20 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer min-h-[38px]"
                    >
                        <XCircle size={14} /> Cancelar
                    </button>
                )}
            </div>
        </div>
    );
});