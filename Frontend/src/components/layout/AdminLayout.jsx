import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Header } from "../admin/AdminHeader.jsx";

export default function AdminLayout({ page, children }) {
  const navigate = useNavigate();
  
  const pageMap = {
    dashboard: "/admin/dashboard",
    tickets: "/admin/tickets",
    customer: "/admin/customer-issues",
    salon: "/admin/salon-issues",
    reports: "/admin/reports",
    settings: "/admin/settings",
  };

  // Helper mapping to bridge string tokens from the dropdown buttons
  const handleDropdownNavigation = (targetPage) => {
    if (pageMap[targetPage]) {
      navigate(pageMap[targetPage]);
    }
  };

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Sidebar Navigation */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar activePage={page} setActivePage={(p) => navigate(pageMap[p])} />
      </div>
      
      {/* Main Content Arena */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Section */}
        <Header 
          activePage={page}
          setActivePage={handleDropdownNavigation} // ✅ Passes the click redirect tracker down
          unreadCount={0}
          onBellClick={() => navigate("/admin/tickets")}
          onSignOut={() => navigate("/admin/login")}
        />
        
        {/* Dynamic Route Viewports */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
