"use client";

import { useState, useMemo } from "react";
import { Search, Coffee, ChevronLeft, ChevronRight } from "lucide-react";
import { MenuGridSkeleton } from "@/src/components/ui/Skeletons";
import { NewProductForm } from "@/src/components/admin/NewProductoForm";
import { MenuItemCard } from "@/src/components/admin/MenuItemCard";

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured?: boolean;
  featured_order?: number;
  is_seasonal?: boolean;
  badge?: string;
}

interface MenuTabProps {
  menuItems: MenuItem[];
  loading?: boolean;
  onAddProduct: (productData: Partial<MenuItem>) => Promise<boolean>;
  onToggleFeatured: (item: MenuItem) => void;
  onToggleSeasonal: (item: MenuItem) => void;
  onOpenEdit: (item: MenuItem) => void;
  onDeleteProduct: (id: string) => void;
}

const ITEMS_PER_PAGE = 8;

export function MenuTab({
  menuItems,
  loading = false,
  onAddProduct,
  onToggleFeatured,
  onToggleSeasonal,
  onOpenEdit,
  onDeleteProduct,
}: MenuTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "cafes" | "postres" | "especiales"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado reactivo en memoria
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, searchQuery, categoryFilter]);

  // Paginación reactiva
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handleCategoryChange = (
    cat: "all" | "cafes" | "postres" | "especiales",
  ) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Formulario desacoplado */}
      <NewProductForm onAddProduct={onAddProduct} />

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14110E] border border-[#2D2620] text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#D57E7E]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#14110E] p-1 rounded-2xl border border-[#2D2620] w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
              categoryFilter === "all"
                ? "bg-[#231F1B] text-white"
                : "text-[#A39B92] hover:text-white"
            }`}
          >
            Todos ({menuItems.length})
          </button>
          <button
            onClick={() => handleCategoryChange("cafes")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
              categoryFilter === "cafes"
                ? "bg-[#231F1B] text-white"
                : "text-[#A39B92] hover:text-white"
            }`}
          >
            Cafés
          </button>
          <button
            onClick={() => handleCategoryChange("postres")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
              categoryFilter === "postres"
                ? "bg-[#231F1B] text-white"
                : "text-[#A39B92] hover:text-white"
            }`}
          >
            Postres
          </button>
          <button
            onClick={() => handleCategoryChange("especiales")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
              categoryFilter === "especiales"
                ? "bg-[#231F1B] text-white"
                : "text-[#A39B92] hover:text-white"
            }`}
          >
            Especiales
          </button>
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <MenuGridSkeleton count={4} />
      ) : filteredItems.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-2">
          <Coffee className="mx-auto text-[#A39B92]" size={32} />
          <p className="text-sm font-semibold text-white">
            No se encontraron productos
          </p>
          <p className="text-xs text-[#A39B92]">
            Intenta cambiar el término de búsqueda o la categoría.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {paginatedItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onToggleFeatured={onToggleFeatured}
                onToggleSeasonal={onToggleSeasonal}
                onOpenEdit={onOpenEdit}
                onDeleteProduct={onDeleteProduct}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#2D2620] text-xs text-[#A39B92]">
              <span>
                Página{" "}
                <span className="text-white font-semibold">{currentPage}</span>{" "}
                de{" "}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-[#14110E] border border-[#2D2620] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-[#14110E] border border-[#2D2620] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
