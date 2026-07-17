import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="relative p-4 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_35%)]" />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
