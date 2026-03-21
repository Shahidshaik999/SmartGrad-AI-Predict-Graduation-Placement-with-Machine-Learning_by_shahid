import { cn } from '../../lib/utils'

function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export default function SkeletonCard() {
  return (
    <div className="space-y-6">
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-28 w-28 rounded-full mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
        ))}
      </div>
      {/* Recommendations */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <Skeleton className="h-3 w-40" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
