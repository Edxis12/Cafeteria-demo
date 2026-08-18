'use client';

import React from 'react';
import { Flame, Sparkles, Trophy, Edit, Trash2 } from 'lucide-react';
import { MenuItem } from './MenuTab';

interface MenuItemCardProps {
    item: MenuItem;
    onToggleFeatured: (item: MenuItem) => void;
    onToggleSeasonal: (item: MenuItem) => void;
    onOpenEdit: (item: MenuItem) => void;
    onDeleteProduct: (id: string) => void;
}

const DEFAULT_IMAGE =
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600';

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

export const MenuItemCard = React.memo(function MenuItemCard({
    item,
    onToggleFeatured,
    onToggleSeasonal,
    onOpenEdit,
    onDeleteProduct,
}: MenuItemCardProps) {
    return (
        <div
            className={`p-3.5 sm:p-4 rounded-3xl bg-[#14110E] border transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between shadow-md ${item.is_seasonal
                    ? 'border-[#D57E7E]/40 shadow-[#D57E7E]/5'
                    : item.is_featured
                        ? 'border-orange-500/40 shadow-orange-500/5'
                        : 'border-[#2D2620] hover:border-white/20'
                }`}
        >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
                <img
                    src={item.image_url || DEFAULT_IMAGE}
                    alt={unescapeHtml(item.title)}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                    loading="lazy"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-black shrink-0 border border-white/5"
                />
                <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-sm text-white truncate">
                            {unescapeHtml(item.title)}
                        </h3>
                        {item.is_featured && (
                            <span className="text-[8px] sm:text-[9px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 flex items-center gap-1">
                                <Trophy size={10} /> Top #{item.featured_order || 1}
                            </span>
                        )}
                        {item.is_seasonal && (
                            <span className="text-[8px] sm:text-[9px] font-bold text-[#D57E7E] uppercase tracking-wider bg-[#D57E7E]/10 px-2 py-0.5 rounded-full border border-[#D57E7E]/20 flex items-center gap-1">
                                <Sparkles size={10} /> Temporada
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[#A39B92] line-clamp-1">
                        {unescapeHtml(item.description)}
                    </p>
                    <span className="text-xs font-bold text-[#D57E7E] block">
                        ${Number(item.price || 0).toFixed(2)} MXN
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0 shrink-0">
                <button
                    onClick={() => onToggleFeatured(item)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${item.is_featured
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30'
                            : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10'
                        }`}
                    title="Marcar / Desmarcar Más Vendido"
                >
                    <Flame size={15} />
                </button>

                <button
                    onClick={() => onToggleSeasonal(item)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${item.is_seasonal
                            ? 'bg-[#D57E7E]/20 text-[#D57E7E] border-[#D57E7E]/40 hover:bg-[#D57E7E]/30'
                            : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10'
                        }`}
                    title="Marcar / Desmarcar Temporada"
                >
                    <Sparkles size={15} />
                </button>

                <button
                    onClick={() => onOpenEdit(item)}
                    className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-amber-500/20"
                    title="Editar Producto"
                >
                    <Edit size={15} />
                </button>

                <button
                    onClick={() => onDeleteProduct(item.id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-rose-500/20"
                    title="Eliminar Producto"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
});