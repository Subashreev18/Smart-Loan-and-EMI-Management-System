import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  HandCoins,
  PlusCircle,
  ClipboardCheck,
  CalendarClock,
} from "lucide-react";

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const commonMenu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Loans", path: "/loans", icon: HandCoins },
    { name: "EMI Tracker", path: "/emi-tracker", icon: CalendarClock },
  ];

  const customerMenu = [
    { name: "Create Loan", path: "/loans/create", icon: PlusCircle },
  ];

  const adminMenu = [
    { name: "Loan Approvals", path: "/admin/loans", icon: ClipboardCheck },
  ];

  const menu =
    user?.role === "admin"
      ? [...commonMenu, ...adminMenu]
      : [...commonMenu, ...customerMenu];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 border-r border-[var(--color-border)] bg-[var(--color-primary)]/95 backdrop-blur transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-20 items-center px-6">
          <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            CredFlow
          </span>
        </div>

        <div className="px-6 pb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Main Menu
          </p>
        </div>

        <nav className="space-y-1 px-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-[var(--color-text-primary)] ring-1 ring-[var(--color-border)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                }`}
            >
              <item.icon size={17} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
