import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckSquare, Trash2 } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import NotificationItem from "./NotificationItem";

export default function NotificationCenter({ triggerClassName, iconClassName }) {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName || "relative p-2 rounded-full hover:bg-[#FEF3E2] transition-colors text-[#3E362E]"}
      >
        <Bell className={iconClassName || "w-5 h-5"} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#EADDCA] z-50 overflow-hidden dd-enter">
          <div className="p-4 border-b border-[#EADDCA] flex items-center justify-between bg-[#FDFBF7]">
            <h3 className="font-black text-[#3E362E] text-sm uppercase tracking-widest flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-[#C5A059] text-white text-[10px] px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={markAllAsRead}
                className="p-1.5 text-stone-500 hover:text-[#C5A059] hover:bg-[#FEF3E2] rounded-md transition-colors"
                title="Mark all as read"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={clearNotifications}
                className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notification={notif} 
                  onMarkRead={markAsRead} 
                />
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-[#EADDCA] text-center bg-[#FDFBF7]">
            <button className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] transition-colors">
              View All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
