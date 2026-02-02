import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl',
        'bg-gradient-to-r from-charcoal via-obsidian to-charcoal',
        'bg-[length:200%_100%]',
        className
      )}
    />
  )
}

export function SwapCardSkeleton() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-charcoal/50 p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex justify-center">
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  )
}

export function TokenListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
