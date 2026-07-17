const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-7 w-48 animate-pulse rounded-md bg-[var(--color-border)]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="h-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] xl:col-span-3" />
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] xl:col-span-2" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
