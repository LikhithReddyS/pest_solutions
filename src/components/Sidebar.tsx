"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  X,
  Bug,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <Bug size={28} />
          <div>
            <h1>Amarnath</h1>
            <p>Pest Solutions</p>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "sidebar-link--active" : ""}`}
                onClick={onClose}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <form action={logout}>
            <button type="submit" className="sidebar-link sidebar-logout">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
