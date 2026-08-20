"use client";

import { useState, useMemo } from "react";
import { Filter, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { ReviewsGridSkeleton } from "@/src/components/ui/Skeletons";
import { ReviewCard } from "./ReviewCard";

export interface AdminReview {
  id: string;
  name: string;
  role: string;
  comment: string;
  stars: number;
  avatar: string;
  is_approved: boolean;
  created_at: string;
}

interface ReviewsTabProps {
  reviews: AdminReview[];
  loading?: boolean;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 6;

export function ReviewsTab({
  reviews,
  loading = false,
  onApprove,
  onDelete,
}: ReviewsTabProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado reactivo de reseñas
  const filteredReviews = useMemo(() => {
    if (filter === "pending") return reviews.filter((r) => !r.is_approved);
    if (filter === "approved") return reviews.filter((r) => r.is_approved);
    return reviews;
  }, [reviews, filter]);

  const pendingCount = useMemo(
    () => reviews.filter((r) => !r.is_approved).length,
    [reviews],
  );

  // Paginación reactiva y ajuste derivado seguro
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const validPage =
    currentPage > totalPages ? Math.max(totalPages, 1) : currentPage;

  const paginatedReviews = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, validPage]);

  const handleFilterChange = (newFilter: "all" | "pending" | "approved") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#A39B92]" />
          <span className="text-xs font-semibold text-[#A39B92]">Filtrar:</span>
          <div className="flex gap-1.5 bg-[#14110E] p-1 rounded-2xl border border-[#2D2620]">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#231F1B] text-white"
                  : "text-[#A39B92] hover:text-white"
              }`}
            >
              Todas ({reviews.length})
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === "pending"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-[#A39B92] hover:text-white"
              }`}
            >
              <span>Por Aprobar</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleFilterChange("approved")}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                filter === "approved"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-[#A39B92] hover:text-white"
              }`}
            >
              Aprobadas ({Math.max(reviews.length - pendingCount, 0)})
            </button>
          </div>
        </div>
      </div>

      {/* Vista de Carga, Vacía o Grid de Reseñas */}
      {loading ? (
        <ReviewsGridSkeleton count={4} />
      ) : filteredReviews.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-2">
          <MessageSquare className="mx-auto text-[#A39B92]" size={32} />
          <p className="text-sm font-semibold text-white">
            No se encontraron reseñas
          </p>
          <p className="text-xs text-[#A39B92]">
            {filter === "pending"
              ? "No hay ninguna reseña pendiente de moderación."
              : "No hay registros en esta sección."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedReviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                onApprove={onApprove}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Paginación de Reseñas */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#2D2620] text-xs text-[#A39B92]">
              <span>
                Página{" "}
                <span className="text-white font-semibold">{validPage}</span> de{" "}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={validPage === 1}
                  className="p-2 rounded-xl bg-[#14110E] border border-[#2D2620] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={validPage === totalPages}
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
