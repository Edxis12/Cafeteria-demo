'use client';

import { useState } from 'react';
import { Plus, Flame, Sparkles, Upload, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary } from '@/src/lib/cloudinary';

const DEFAULT_IMAGE =
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600';

interface NewProductFormProps {
    onAddProduct: (productData: any) => Promise<boolean>;
}

export function NewProductForm({ onAddProduct }: NewProductFormProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newCategory, setNewCategory] = useState('cafes');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newIsFeatured, setNewIsFeatured] = useState(false);
    const [newFeaturedOrder, setNewFeaturedOrder] = useState<number>(1);
    const [newIsSeasonal, setNewIsSeasonal] = useState(false);
    const [newBadge, setNewBadge] = useState('Top #1 Más Vendido');
    const [isAdding, setIsAdding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newPrice) return;
        setIsAdding(true);

        const success = await onAddProduct({
            title: newTitle.trim(),
            description: newDesc.trim(),
            price: parseFloat(newPrice),
            category: newCategory,
            image_url: newImageUrl.trim() || DEFAULT_IMAGE,
            is_featured: newIsFeatured,
            featured_order: Number(newFeaturedOrder),
            is_seasonal: newIsSeasonal,
            badge: newBadge.trim() || `Top #${newFeaturedOrder} Más Vendido`,
        });

        if (success) {
            setNewTitle('');
            setNewDesc('');
            setNewPrice('');
            setNewImageUrl('');
            setNewIsFeatured(false);
            setNewFeaturedOrder(1);
            setNewIsSeasonal(false);
            setNewBadge('Top #1 Más Vendido');
        }
        setIsAdding(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadImageToCloudinary(file);
            setNewImageUrl(url);
        } catch (error: any) {
            alert(error.message || 'Error al subir la imagen');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-8 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-4 sm:space-y-6 shadow-xl"
        >
            <div className="flex items-center gap-2 border-b border-[#2D2620] pb-3 sm:pb-4">
                <Plus size={18} className="text-[#D57E7E]" />
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                    Agregar Nuevo Producto al Catálogo
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#C5BCB3]">Nombre del Producto</label>
                    <input
                        type="text"
                        placeholder="Ej. Flat White Velvet"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#C5BCB3]">Precio (MXN)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ej. 75.00"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        required
                        className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                    />
                </div>

                <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#C5BCB3]">Categoría</label>
                    <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none [color-scheme:dark]"
                    >
                        <option value="cafes">Cafés y Bebidas</option>
                        <option value="postres">Postres y Repostería</option>
                        <option value="especiales">Especiales de la Casa</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#C5BCB3]">Descripción Corta</label>
                    <input
                        type="text"
                        placeholder="Notas de cata, ingredientes o método de extracción..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#C5BCB3]">Imagen del Producto</label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="URL o sube un archivo..."
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                        />
                        <label className="px-4 py-3 rounded-2xl bg-[#231F1B] border border-[#2D2620] hover:border-[#D57E7E] text-xs text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                            {isUploading ? (
                                <Loader2 size={14} className="animate-spin text-[#D57E7E]" />
                            ) : (
                                <Upload size={14} className="text-[#D57E7E]" />
                            )}
                            <span className="hidden sm:inline">{isUploading ? 'Subiendo...' : 'Subir'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1814] border border-[#2D2620] space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={newIsFeatured}
                            onChange={(e) => {
                                setNewIsFeatured(e.target.checked);
                                if (e.target.checked) setNewBadge(`Top #${newFeaturedOrder} Más Vendido`);
                            }}
                            className="w-4 h-4 rounded accent-[#D57E7E]"
                        />
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Flame size={14} className="text-orange-400" /> Marcar como "Más Vendido"
                        </span>
                    </label>

                    {newIsFeatured && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/5">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-[#A39B92] mb-1">
                                    Posición en Home
                                </label>
                                <select
                                    value={newFeaturedOrder}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setNewFeaturedOrder(val);
                                        setNewBadge(`Top #${val} Más Vendido`);
                                    }}
                                    className="w-full p-2 rounded-xl bg-[#0C0A09] border border-[#2D2620] text-xs text-orange-400 font-bold outline-none [color-scheme:dark]"
                                >
                                    <option value={1}>Top #1 (Primero)</option>
                                    <option value={2}>Top #2 (Segundo)</option>
                                    <option value={3}>Top #3 (Tercero)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-[#A39B92] mb-1">
                                    Texto Insignia
                                </label>
                                <input
                                    type="text"
                                    value={newBadge}
                                    onChange={(e) => setNewBadge(e.target.value)}
                                    className="p-2 rounded-xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1814] border border-[#2D2620] flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={newIsSeasonal}
                            onChange={(e) => setNewIsSeasonal(e.target.checked)}
                            className="w-4 h-4 rounded accent-[#D57E7E]"
                        />
                        <div>
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Sparkles size={14} className="text-[#D57E7E]" /> Lanzamiento de Temporada
                            </span>
                            <span className="text-[11px] text-[#A39B92] block">
                                Aparecerá en el carrusel de lanzamientos especiales.
                            </span>
                        </div>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isAdding}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D57E7E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c26d6d] transition-all cursor-pointer disabled:opacity-50 min-h-[44px] shadow-lg shadow-[#D57E7E]/20"
            >
                {isAdding ? 'Guardando...' : 'Publicar Producto'}
            </button>
        </form>
    );
}