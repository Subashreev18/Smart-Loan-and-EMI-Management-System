const StatCard = ({
  title,
  value,
  icon: Icon,
  accent = "from-teal-500 to-cyan-500",
  helperText,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl/30">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
          {helperText ? (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              {helperText}
            </p>
          ) : null}
        </div>

        {Icon ? (
          <div
            className={`rounded-xl bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
