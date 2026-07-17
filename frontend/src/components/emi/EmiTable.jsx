import EmiRow from "./EmiRow";

const EmiTable = ({ loan, onMarkPaid, loadingMonth }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl/20">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          Loan #{loan.loanId.slice(-6)} EMI Schedule
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Remaining:{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(loan.remainingAmount)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[var(--color-primary)]/70">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Due Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Paid Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Payment Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loan.emiSchedule.map((item) => (
              <EmiRow
                key={item.month}
                item={item}
                onMarkPaid={(month) => onMarkPaid(loan.loanId, month)}
                marking={loadingMonth === `${loan.loanId}-${item.month}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmiTable;
