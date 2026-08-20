"use client";

import { useState } from "react";
import { X, Flame, Sparkles, Upload, Loader2 } from "lucide-react";
import { MenuItem } from "./MenuTab";
import { uploadImageToCloudinary } from "@/src/lib/cloudinary";

interface EditMenuModalProps {
  item: MenuItem;
  onClose: () => void;
  onUpdate: (updatedItem: Partial<MenuItem>) => Promise<void>;
  isUpdating: boolean;
}

export function EditMenuModal({
  item,
  onClose,
  onUpdate,
  isUpdating,
}: EditMenuModalProps) {
  const [title, setTitle] = useState(item.title);
  const [desc, setDesc] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category);
  const [imageUrl, setImageUrl] = useState(item.image_url);
  const [isFeatured, setIsFeatured] = useState(!!item.is_featured);
  const [featuredOrder, setFeaturedOrder] = useState<number>(
    item.featured_order || 1,
  );
  const [isSeasonal, setIsSeasonal] = useState(!!item.is_seasonal);
  const [badge, setBadge] = useState(item.badge || "Más Vendido");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Error al subir la imagen";
      alert(msg);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Limpieza del input de archivo
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = parseFloat(price);
    if (!title.trim() || isNaN(cleanPrice)) return;

    onUpdate({
      title: title.trim(),
      description: desc.trim(),
      price: cleanPrice,
      category,
      image_url: imageUrl.trim() || item.image_url,
      is_featured: isFeatured,
      featured_order: Number(featuredOrder),
      is_seasonal: isSeasonal,
      badge: badge.trim() || `Top #${featuredOrder} Más Vendido`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-[#14110E] border border-[#2D2620] rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl my-auto">
        <div className="flex justify-between items-center border-b border-[#2D2620] pb-3">
          <h3 className="font-serif font-bold text-base sm:text-lg text-white">
            Editar Producto
          </h3>
          <button
            onClick={onClose}
            className="text-[#A39B92] hover:text-white cursor-pointer p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A39B92] mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A39B92] mb-1">
                Precio (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A39B92] mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none [color-scheme:dark]"
              >
                <option value="cafes">Cafés y Bebidas</option>
                <option value="postres">Postres y Repostería</option>
                <option value="especiales">Especiales</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39B92] mb-1">
              Descripción
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39B92] mb-1">
              Imagen del Producto
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL o sube una nueva imagen..."
                className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
              />
              <label className="px-4 py-3 rounded-2xl bg-[#231F1B] border border-[#2D2620] hover:border-[#D57E7E] text-xs text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                {isUploading ? (
                  <Loader2 size={14} className="animate-spin text-[#D57E7E]" />
                ) : (
                  <Upload size={14} className="text-[#D57E7E]" />
                )}
                <span className="hidden sm:inline">
                  {isUploading ? "Subiendo..." : "Subir"}
                </span>
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

          <div className="p-3.5 rounded-2xl bg-[#1C1814] border border-[#2D2620] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    if (e.target.checked && !badge) {
                      setBadge(`Top #${featuredOrder} Más Vendido`);
                    }
                  }}
                  className="w-4 h-4 rounded accent-[#D57E7E]"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Flame size={13} className="text-orange-400" /> Marcar como
                  Más Vendido
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSeasonal}
                  onChange={(e) => setIsSeasonal(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#D57E7E]"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles size={13} className="text-[#D57E7E]" /> Temporada
                </span>
              </label>
            </div>

            {isFeatured && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A39B92] mb-1">
                    Posición en el Top
                  </label>
                  <select
                    value={featuredOrder}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFeaturedOrder(val);
                      setBadge(`Top #${val} Más Vendido`);
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#0C0A09] border border-[#2D2620] text-xs text-orange-400 font-bold outline-none [color-scheme:dark]"
                  >
                    <option value={1}>Top #1 (Primero)</option>
                    <option value={2}>Top #2 (Segundo)</option>
                    <option value={3}>Top #3 (Tercero)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A39B92] mb-1">
                    Texto de la Insignia
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-2xl bg-[#1C1814] text-[#A39B92] text-xs font-semibold hover:text-white cursor-pointer min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating || isUploading}
              className="w-1/2 py-3 rounded-2xl bg-[#D57E7E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c26d6d] cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
            >
              {isUpdating ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
