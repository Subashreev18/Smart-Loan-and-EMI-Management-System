import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/cards/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import LoanStatusBarChart from "../../components/charts/LoanStatusBarChart";
import LoanStatusPieChart from "../../components/charts/LoanStatusPieChart";
import { getLoans } from "../../services/loanService";
import { useAuth } from "../../hooks/useAuth";
import { EMI_UPDATED_EVENT } from "../../utils/emiEvents";
import {
  Landmark,
  Clock3,
  CircleCheckBig,
  WalletCards,
  WalletMinimal,
  HandCoins,
} from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    completed: 0,
    totalAmountToBePaid: 0,
    totalAmountPaid: 0,
    remainingAmount: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const loans = await getLoans();
      const completedLoans = loans.filter((l) => l.status === "completed");
      const pendingLoans = loans.filter((l) => l.status !== "completed");
      const totalAmountToBePaid = loans.reduce(
        (acc, loan) => acc + Number(loan.totalPayable || 0),
        0
      );
      const remainingAmount = loans.reduce(
        (acc, loan) => acc + Number(loan.remainingAmount || 0),
        0
      );

      setStats({
        total: loans.length,
        pending: pendingLoans.length,
        completed: completedLoans.length,
        totalAmountToBePaid,
        remainingAmount,
        totalAmountPaid: Math.max(totalAmountToBePaid - remainingAmount, 0),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.role]);

  useEffect(() => {
    const handleEmiUpdate = () => {
      fetchStats();
    };

    window.addEventListener(EMI_UPDATED_EVENT, handleEmiUpdate);
    return () => window.removeEventListener(EMI_UPDATED_EVENT, handleEmiUpdate);
  }, [user?.role]);

  const cards = [
    {
      title: "Total Loans",
      value: stats.total,
      icon: Landmark,
      accent: "from-cyan-500 to-blue-500",
      helperText: "All loan applications",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock3,
      accent: "from-indigo-500 to-violet-500",
      helperText: "Not yet completed",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CircleCheckBig,
      accent: "from-purple-500 to-fuchsia-500",
      helperText: "Fully repaid loans",
    },
    {
      title: "Total Amount to be Paid",
      value: formatCurrency(stats.totalAmountToBePaid),
      icon: WalletCards,
      accent: "from-sky-500 to-indigo-500",
      helperText: "Combined payable amount",
    },
    {
      title: "Total Amount Paid",
      value: formatCurrency(stats.totalAmountPaid),
      icon: HandCoins,
      accent: "from-teal-500 to-cyan-500",
      helperText: "EMI paid so far",
    },
    {
      title: "Remaining Amount",
      value: formatCurrency(stats.remainingAmount),
      icon: WalletMinimal,
      accent: "from-purple-500 to-fuchsia-500",
      helperText: "Outstanding EMI balance",
    },
  ];

  const barChartData = [
    { name: "Total Amount", value: stats.totalAmountToBePaid },
    { name: "Paid Amount", value: stats.totalAmountPaid },
    { name: "Remaining Amount", value: stats.remainingAmount },
  ];

  const pieChartData = [
    { name: "Paid", value: stats.totalAmountPaid },
    { name: "Remaining", value: stats.remainingAmount },
  ];

  return (
    <DashboardLayout>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="animate-[fadeIn_0.35s_ease-out] space-y-6">
          <section>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Welcome back, {user?.name}. Here is a quick snapshot of your loan
              pipeline.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                accent={card.accent}
                helperText={card.helperText}
              />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <LoanStatusBarChart data={barChartData} />
            </div>
            <div className="xl:col-span-2">
              <LoanStatusPieChart data={pieChartData} />
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
