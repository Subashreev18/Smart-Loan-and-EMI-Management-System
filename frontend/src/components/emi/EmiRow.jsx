const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN");
};

const EmiRow = ({ item, onMarkPaid, marking }) => {
  const isPaid = item.status === "paid";

  return (
    <tr className="border-b border-[var(--color-border)]/60 transition hover:bg-[var(--color-surface)]/60">
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
        Month {item.month}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(item.amount)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isPaid
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {isPaid ? "Paid" : "Pending"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
        {formatDate(item.paidDate)}
      </td>
      <td className="px-4 py-3">
        <button
          disabled={isPaid || marking}
          onClick={() => onMarkPaid(item.month)}
          className="cursor-pointer rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaid ? "Paid" : marking ? "Updating..." : "Mark as Paid"}
        </button>
      </td>
    </tr>
  );
};

export default EmiRow;
