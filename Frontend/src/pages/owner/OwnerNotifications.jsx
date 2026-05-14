import React from "react";
import { Bell, ArrowLeft, Settings, Trash2, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import NotificationItem from "../../Components/notifications/NotificationItem";
import AnnouncementHistory from "../../Components/notifications/AnnouncementHistory";

export default function OwnerNotifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotification();
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-[#faf8f5] font-sans overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="bg-[#faf8f5] border-b border-orange-100 px-4 sm:px-6 xl:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-xl border border-orange-100 text-gray-600 hover:bg-orange-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-bold">Back</span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-gray-800">
                Notification <span className="text-orange-500">Center</span>
              </h1>
              <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-0.5">
                Manage your alerts and past communications
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl border border-orange-100 text-gray-600 hover:bg-orange-50 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 xl:p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
            
            {/* Left Column: Inbox (Notifications) */}
            <div className="bg-white border border-orange-100 rounded-3xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Inbox</h2>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">
                      {unreadCount} UNREAD ALERTS
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={markAllAsRead}
                    className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors"
                    title="Mark all as read"
                  >
                    <CheckSquare size={16} />
                  </button>
                  <button 
                    onClick={clearNotifications}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Bell className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">All Caught Up!</h3>
                    <p className="text-sm text-gray-500 mt-1">No new notifications in your inbox.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <NotificationItem notification={notif} onMarkRead={markAsRead} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Communication History */}
            <div className="flex flex-col">
              <AnnouncementHistory />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
