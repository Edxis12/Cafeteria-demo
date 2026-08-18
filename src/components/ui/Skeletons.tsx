import { Skeleton } from './Skeleton';

// 1. Skeleton para Productos del Menú
export function MenuCardSkeleton() {
    return (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-4 shadow-xl">
            <Skeleton className="w-full h-44 sm:h-48 rounded-2xl" />
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-36 rounded-lg" />
                    <Skeleton className="h-4 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
        </div>
    );
}

export function MenuGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <MenuCardSkeleton key={i} />
            ))}
        </div>
    );
}

// 2. Skeleton para Reseñas (Testimonios)
export function ReviewCardSkeleton() {
    return (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28 rounded-md" />
                        <Skeleton className="h-2.5 w-20 rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-24 rounded-md" />
            <div className="space-y-1.5">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
            </div>
        </div>
    );
}

export function ReviewsGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ReviewCardSkeleton key={i} />
            ))}
        </div>
    );
}

// 3. Skeleton para Reservas en el Dashboard Admin
export function ReservationRowSkeleton() {
    return (
        <div className="p-5 rounded-3xl bg-[#14110E] border border-[#2D2620] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xl">
            <div className="space-y-2.5 w-full">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-3 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
        </div>
    );
}