import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  CalendarDays,
  Wallet,
  Bell,
  Settings,
  Star,
  BarChart3,
  Scissors,
  LogOut,
  CheckCircle,
  HelpCircle,
  FileBarChart,
  Shield,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Salon Management", icon: <Store size={20} />, path: "/admin/salon-management" },
    { name: "Salon Approvals", icon: <CheckCircle size={20} />, path: "/admin/salon-approvals" },
    { name: "Customers", icon: <Users size={20} />, path: "/admin/customers" },
    { name: "Bookings", icon: <CalendarDays size={20} />, path: "/admin/bookings" },
    { name: "Payments", icon: <Wallet size={20} />, path: "/admin/payments" },
    { name: "Subscriptions", icon: <Wallet size={20} />, path: "/admin/subscriptions" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/admin/analytics" },
    { name: "Reports", icon: <FileBarChart size={20} />, path: "/admin/reports" },
    { name: "Barbers", icon: <Scissors size={20} />, path: "/admin/barbers" },
    { name: "Reviews", icon: <Star size={20} />, path: "/admin/reviews" },
    { name: "Support Tickets", icon: <HelpCircle size={20} />, path: "/admin/support" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/admin/notifications" },
    { name: "Security Logs", icon: <Shield size={20} />, path: "/admin/security" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  return (
    <>
      {/* MOBILE TRIGGER BUTTON - Header layout on small screens */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0B0B0B] border-b border-[#2d2419] h-16 px-4 flex items-center justify-between z-50">
        <h1 className="text-xl font-black text-[#D6B36A] tracking-wide">
          BARBER ADMIN
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 text-[#D6B36A] hover:bg-[#151515] rounded-xl transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* BACKGROUND OVERLAY (Mobile only) - Closes sidebar when clicking outside */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`w-[280px] h-screen bg-[#0B0B0B] border-r border-[#2d2419] text-white p-6 flex flex-col justify-between fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:pt-6 pt-24`} 
          /* Mobile pe top header ke niche space dene ke liye pt-24 use kiya hai */
      >
        <div>
          {/* LOGO (Hidden on mobile header, shown on desktop sidebar) */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-3xl font-black text-[#D6B36A] tracking-wide">
              BARBER ADMIN
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Premium Salon Panel
            </p>
          </div>

          {/* MENU ITEMS */}
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)} // Mobile par link click hote hi menu close ho jaye
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition duration-300 font-medium ${
                    isActive
                      ? "bg-[#D6B36A] text-black shadow-lg"
                      : "hover:bg-[#151515] text-gray-300"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>   
              </NavLink>
            ))}
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-8">
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2d2419] px-5 py-4 rounded-2xl transition duration-300 text-red-400 font-semibold">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}