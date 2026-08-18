'use client';

import React from 'react';
import { Star, CheckCircle, Trash2, Clock } from 'lucide-react';
import { AdminReview } from './ReviewsTab';

interface ReviewCardProps {
    review: AdminReview;
    onApprove: (id: string) => void;
    onDelete: (id: string) => void;
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

export const ReviewCard = React.memo(function ReviewCard({
    review: rev,
    onApprove,
    onDelete,
}: ReviewCardProps) {
    return (
        <div
            className={`p-5 sm:p-6 rounded-3xl bg-[#14110E] border space-y-4 shadow-xl transition-all flex flex-col justify-between ${rev.is_approved
                    ? 'border-[#2D2620] hover:border-white/20'
                    : 'border-amber-500/40 bg-amber-500/[0.03]'
                }`}
        >
            <div className="space-y-3">
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#231F1B] border border-[#2D2620] text-[#D57E7E] flex items-center justify-center font-bold text-xs shrink-0 font-serif">
                            {rev.avatar || 'CL'}
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-sm text-white leading-tight">
                                {unescapeHtml(rev.name)}
                            </h4>
                            <span className="text-[11px] text-[#A39B92]">
                                {unescapeHtml(rev.role || 'Cliente Frecuente')}
                            </span>
                        </div>
                    </div>

                    <span
                        className={`text-[9px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1 shrink-0 ${rev.is_approved
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}
                    >
                        {rev.is_approved ? (
                            <>
                                <CheckCircle size={10} /> Publicada
                            </>
                        ) : (
                            <>
                                <Clock size={10} /> Por Aprobar
                            </>
                        )}
                    </span>
                </div>

                {/* Estrellas */}
                <div className="flex items-center gap-1 text-orange-400">
                    {[...Array(rev.stars || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                    ))}
                    <span className="text-[11px] text-[#A39B92] ml-1.5 font-semibold">
                        {rev.stars}.0
                    </span>
                </div>

                {/* Comentario */}
                <p className="text-xs sm:text-sm text-[#C5BCB3] italic leading-relaxed">
                    "{unescapeHtml(rev.comment)}"
                </p>
            </div>

            {/* Pie de tarjeta con Acciones */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-[#A39B92]">
                <span>
                    {rev.created_at
                        ? new Date(rev.created_at).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                        : ''}
                </span>

                <div className="flex items-center gap-2">
                    {!rev.is_approved && (
                        <button
                            onClick={() => onApprove(rev.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer min-h-[32px]"
                        >
                            <CheckCircle size={13} /> Aprobar
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(rev.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/20 transition-colors cursor-pointer min-h-[32px]"
                    >
                        <Trash2 size={13} /> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
});