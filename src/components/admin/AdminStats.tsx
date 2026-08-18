import { Utensils, AlertCircle, Users, Sparkles } from 'lucide-react';

interface AdminStatsProps {
    stats: {
        total: number;
        pending: number;
        confirmedGuests: number;
        seasonalCount: number;
    };
}

export function AdminStats({ stats }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-1.5">
                <div className="flex items-center justify-between text-[#A39B92]">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Total Reservas</span>
                    <Utensils size={15} className="text-[#D57E7E]" />
                </div>
                <div className="text-xl sm:text-3xl font-serif font-bold text-white">{stats.total}</div>
                <p className="text-[10px] text-[#A39B92]">Histórico acumulado</p>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-1.5">
                <div className="flex items-center justify-between text-[#A39B92]">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Por Confirmar</span>
                    <AlertCircle size={15} className="text-amber-400" />
                </div>
                <div className="text-xl sm:text-3xl font-serif font-bold text-amber-400">{stats.pending}</div>
                <p className="text-[10px] text-[#A39B92]">Atención requerida</p>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-1.5">
                <div className="flex items-center justify-between text-[#A39B92]">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Comensales</span>
                    <Users size={15} className="text-emerald-400" />
                </div>
                <div className="text-xl sm:text-3xl font-serif font-bold text-emerald-400">{stats.confirmedGuests}</div>
                <p className="text-[10px] text-[#A39B92]">Personas estimadas</p>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-1.5">
                <div className="flex items-center justify-between text-[#A39B92]">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Temporada</span>
                    <Sparkles size={15} className="text-[#D57E7E]" />
                </div>
                <div className="text-xl sm:text-3xl font-serif font-bold text-[#D57E7E]">{stats.seasonalCount}</div>
                <p className="text-[10px] text-[#A39B92]">En carrusel de Home</p>
            </div>
        </div>
    );
}