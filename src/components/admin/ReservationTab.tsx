'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReservationRowSkeleton } from '../ui/Skeletons';
import { ReservationRow } from './ReservationRow';

export interface Reservation {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    guests: number;
    reservation_date: string;
    reservation_time: string;
    zone?: string;
    status: string;
}

interface ReservationsTabProps {
    reservations: Reservation[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    statusFilter: string;
    setStatusFilter: (f: 'all' | 'pending' | 'confirmed' | 'cancelled') => void;
    updateStatus: (id: string, status: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function ReservationsTab({
    reservations,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus,
}: ReservationsTabProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Paginación reactiva
    const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE) || 1;

    // Ajuste automático si el filtro reduce las páginas disponibles
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const paginatedReservations = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return reservations.slice(start, start + ITEMS_PER_PAGE);
    }, [reservations, currentPage]);

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-stretch md:items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, email o teléfono..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#14110E] border border-[#2D2620] focus:border-[#D57E7E] text-xs text-white outline-none transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {[
                        { id: 'all', label: 'Todas' },
                        { id: 'pending', label: 'Pendientes' },
                        { id: 'confirmed', label: 'Confirmadas' },
                        { id: 'cancelled', label: 'Canceladas' },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => {
                                setStatusFilter(f.id as any);
                                setCurrentPage(1);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${statusFilter === f.id
                                    ? 'bg-[#231F1B] text-[#D57E7E] border border-[#D57E7E]/40'
                                    : 'bg-[#14110E] text-[#A39B92] border border-[#2D2620] hover:text-white'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estados de Carga y Resultados */}
            {loading ? (
                <div className="grid gap-3 sm:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <ReservationRowSkeleton key={i} />
                    ))}
                </div>
            ) : reservations.length === 0 ? (
                <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-2">
                    <p className="text-sm font-semibold text-white">No se encontraron reservas</p>
                    <p className="text-xs text-[#A39B92]">Prueba cambiando los filtros de búsqueda.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 sm:gap-4">
                        {paginatedReservations.map((res) => (
                            <ReservationRow
                                key={res.id}
                                reservation={res}
                                updateStatus={updateStatus}
                            />
                        ))}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-[#2D2620] text-xs text-[#A39B92]">
                            <span>
                                Página <span className="text-white font-semibold">{currentPage}</span> de{' '}
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
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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