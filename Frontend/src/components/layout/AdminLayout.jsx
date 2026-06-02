import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Header } from "../admin/AdminLayout.jsx";

export default function AdminLayout({ page, children }) {
  const navigate = useNavigate();
  const pageMap = {
    dashboard: "/admin/dashboard",
    tickets: "/admin/tickets",
    customer: "/admin/customer-issues",
    salon: "/admin/salon-issues",
    reports: "/admin/reports",
    settings: "/admin/settings"
  };

  return (
    <div className="flex min-h-screen bg-orange-50">
      <div className="hidden lg:flex shrink-0">
        <Sidebar activePage={page} setActivePage={(p) => navigate(pageMap[p])} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header activePage={page} unreadCount={0} onBellClick={() => navigate("/admin/tickets")} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
