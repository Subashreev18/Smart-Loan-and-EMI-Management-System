import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmiTable from "../../components/emi/EmiTable";
import { getLoans } from "../../services/loanService";
import { markLoanEmiPaid } from "../../services/emiService";
import {
  emitEmiUpdated,
  LOAN_CREATED_EVENT,
  EMI_UPDATED_EVENT,
} from "../../utils/emiEvents";

const buildFallbackSchedule = (loan) => {
  const months = Number(loan.tenure || 0);
  const totalPayable = Number(loan.totalPayable || 0);
  if (!months || !totalPayable) {
    return [];
  }

  const monthlyAmount = Number((totalPayable / months).toFixed(2));
  let allocated = 0;
  return Array.from({ length: months }, (_, index) => {
    const isLast = index === months - 1;
    const amount = isLast
      ? Number((totalPayable - allocated).toFixed(2))
      : monthlyAmount;
    allocated += amount;
    return {
      month: index + 1,
      amount,
      status: "pending",
      paidDate: null,
    };
  });
};

const EmiTracker = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingMonth, setLoadingMonth] = useState("");

  const loadEmiData = async () => {
    try {
      setLoading(true);
      setError("");
      const loans = await getLoans();

      if (!loans.length) {
        setItems([]);
        return;
      }

      const normalizedLoans = loans.map((loan) => ({
        loanId: loan._id,
        status: loan.status,
        emi: loan.emi,
        totalPayable: loan.totalPayable,
        remainingAmount: loan.remainingAmount,
        emiSchedule:
          Array.isArray(loan.emiSchedule) && loan.emiSchedule.length
            ? loan.emiSchedule
            : buildFallbackSchedule(loan),
      }));

      setItems(normalizedLoans);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load EMI tracker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmiData();
  }, []);

  useEffect(() => {
    const refresh = () => {
      loadEmiData();
    };
    window.addEventListener(LOAN_CREATED_EVENT, refresh);
    window.addEventListener(EMI_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(LOAN_CREATED_EVENT, refresh);
      window.removeEventListener(EMI_UPDATED_EVENT, refresh);
    };
  }, []);

  const handleMarkPaid = async (loanId, month) => {
    const key = `${loanId}-${month}`;
    try {
      setLoadingMonth(key);
      const data = await markLoanEmiPaid(loanId, month);

      setItems((prev) =>
        prev.map((loan) =>
          loan.loanId === loanId
            ? {
                ...loan,
                emiSchedule: data.emiSchedule,
                remainingAmount: data.remainingAmount,
                status: data.status,
              }
            : loan
        )
      );

      emitEmiUpdated({ loanId, month, remainingAmount: data.remainingAmount });
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to mark EMI as paid");
    } finally {
      setLoadingMonth("");
    }
  };

  return (
    <DashboardLayout>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          EMI Tracker
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Track month-wise installments, due amounts, and payment status.
        </p>
      </section>

      {error ? (
        <div className="mb-4 rounded-lg bg-rose-500/15 px-4 py-2 text-sm text-rose-400">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-text-muted)]">
          Loading EMI schedules...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-text-muted)]">
          No loans found.
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((loan) => (
            <EmiTable
              key={loan.loanId}
              loan={loan}
              onMarkPaid={handleMarkPaid}
              loadingMonth={loadingMonth}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmiTracker;
