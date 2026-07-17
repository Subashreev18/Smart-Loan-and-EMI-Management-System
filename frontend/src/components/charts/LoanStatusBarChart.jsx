import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const LoanStatusBarChart = ({ data }) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl/20">
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
        Financial Overview
      </h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Total payable vs paid vs remaining amounts.
      </p>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.24)" />
            <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
            <YAxis stroke="#64748b" tickLine={false} allowDecimals={false} tickFormatter={formatCurrency} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanStatusBarChart;
