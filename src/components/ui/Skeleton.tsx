interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-[#231F1B]/70 rounded-2xl border border-[#2D2620]/40 ${className}`}
        />
    );
}