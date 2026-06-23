"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>
            Amarnath Pest Solutions
          </span>
        </header>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
