'use client';

import { MenuItem } from '@/src/types/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Sparkles } from 'lucide-react';

interface ItemModalProps {
    item: MenuItem | null;
    onClose: () => void;
}

export function ItemModal({ item, onClose }: ItemModalProps) {
    if (!item) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-[#181512] text-[#F8F5F2] rounded-2xl overflow-hidden border border-[#2D2620] shadow-2xl"
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Imagen Header */}
                    <div className="relative h-64 w-full overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181512] via-transparent to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-[#F8F5F2]">
                                    {item.name}
                                </h3>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2.5 py-0.5 rounded-full bg-[#D57E7E]/20 text-[#D57E7E] border border-[#D57E7E]/30"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-2xl font-semibold text-[#D57E7E]">
                                ${item.price.toFixed(2)}
                            </span>
                        </div>

                        <p className="text-[#A39B92] leading-relaxed text-sm">
                            {item.description}
                        </p>

                        <div className="pt-4 border-t border-[#2D2620] flex items-center justify-between text-xs text-[#A39B92]">
                            <span className="flex items-center gap-1.5">
                                <Coffee size={16} className="text-[#D57E7E]" /> Preparado al momento
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles size={16} className="text-[#D57E7E]" /> Granos de Selección
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}