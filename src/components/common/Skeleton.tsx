import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/90 dark:bg-slate-800/80 rounded-lg ${className}`}
    />
  );
};

/**
 * BarberCardSkeleton: Exact replica of a Barber Card in the Customer Discovery Portal
 */
export const BarberCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-sm">
      {/* Image Preview Skeleton with Aspect Ratio */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800 animate-pulse overflow-hidden">
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />

        {/* Distance & Rating Badges Placeholders */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
          <div className="h-6 w-24 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 animate-pulse" />
          <div className="h-6 w-16 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 animate-pulse" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 space-y-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>

        {/* Bio description lines */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>

        {/* Services tags */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-4 w-14 rounded-full" />
          <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        {/* Location & Hours */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-1/3 rounded" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="pt-2">
          <Skeleton className="h-12 w-full rounded-xl bg-blue-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

/**
 * BarberListSkeleton: Grid of BarberCardSkeletons
 */
export const BarberListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BarberCardSkeleton key={`barber-skeleton-${i}`} />
      ))}
    </div>
  );
};

/**
 * DashboardOverviewSkeleton: Top Profile Bar Skeleton in Barber Dashboard
 */
export const DashboardOverviewSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shrink-0" />
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-60 sm:w-80 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

/**
 * DashboardScheduleSkeleton: Slot matrix skeleton for the Barber Dashboard
 */
export const DashboardScheduleSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Switcher Bar Skeleton */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-52 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Color Code Legend Skeleton */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] px-4 sm:px-5 py-3">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      {/* Graphical Slots Grid Skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`slot-skeleton-${i}`}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * TemplateListSkeleton: Skeleton for shift templates list
 */
export const TemplateListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`template-skeleton-${i}`}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-48 rounded" />
          <div className="pt-2 flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * GalleryGridSkeleton: Skeleton for 4-photo barbershop gallery
 */
export const GalleryGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`gallery-skeleton-${i}`}
          className="aspect-square rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 animate-pulse overflow-hidden p-3 flex flex-col justify-end"
        >
          <Skeleton className="h-4 w-3/4 rounded mb-1" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
};
