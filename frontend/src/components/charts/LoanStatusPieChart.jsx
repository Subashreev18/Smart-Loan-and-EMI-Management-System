import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#14b8a6", "#6366f1"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const LoanStatusPieChart = ({ data }) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl/20">
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
        Paid vs Remaining
      </h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Share of paid amount compared to remaining balance.
      </p>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
              }}
            />
            <Legend wrapperStyle={{ color: "var(--color-text-muted)", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanStatusPieChart;
