'use client';

import { MenuItem } from '@/src/types/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Sparkles } from 'lucide-react';

interface ItemModalProps {
    item: MenuItem | null;
    onClose: () => void;
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

export function ItemModal({ item, onClose }: ItemModalProps) {
    if (!item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto cursor-pointer"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#181512] text-[#F8F5F2] rounded-3xl border border-[#2D2620] shadow-2xl my-auto cursor-default"
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-white/10"
                        title="Cerrar"
                    >
                        <X size={18} />
                    </button>

                    {/* Imagen Header */}
                    <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-black">
                        <img
                            src={item.image || DEFAULT_IMAGE}
                            alt={unescapeHtml(item.name)}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181512] via-transparent to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 sm:p-7 space-y-4">
                        <div className="flex justify-between items-start gap-3">
                            <div className="space-y-2">
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F8F5F2] leading-tight">
                                    {unescapeHtml(item.name)}
                                </h3>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#D57E7E]/15 text-[#D57E7E] border border-[#D57E7E]/30 font-semibold"
                                            >
                                                {unescapeHtml(tag)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-[#D57E7E] shrink-0 font-serif">
                                ${Number(item.price || 0).toFixed(2)}
                            </span>
                        </div>

                        <p className="text-[#A39B92] leading-relaxed text-xs sm:text-sm">
                            {unescapeHtml(item.description)}
                        </p>

                        <div className="pt-4 border-t border-[#2D2620] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-[#A39B92]">
                            <span className="flex items-center gap-1.5">
                                <Coffee size={15} className="text-[#D57E7E] shrink-0" /> Preparado al momento
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles size={15} className="text-[#D57E7E] shrink-0" /> Granos de Selección
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}