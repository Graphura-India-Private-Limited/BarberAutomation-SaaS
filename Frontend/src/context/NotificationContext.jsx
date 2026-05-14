import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Mock initial data
  useEffect(() => {
    setNotifications([
      { id: 1, type: "system", title: "System Update", message: "BarberPro v2.0 is live!", time: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 2, type: "promotional", title: "Weekend Offer", message: "20% OFF on all Men's grooming services this weekend.", time: new Date(Date.now() - 86400000).toISOString(), read: true },
    ]);

    setAnnouncements([
      { id: 101, title: "🔥 Weekend Offer – 20% OFF", message: "Get a fresh fade with our weekend special discount.", type: "Offers", audience: "All Customers", date: new Date().toISOString() },
      { id: 102, title: "📢 Holiday Notice", message: "Salon will be closed on Monday.", type: "Important Updates", audience: "All Customers", date: new Date().toISOString() },
    ]);
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      ...notification,
      id: Date.now(),
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    
    // Play sound (optional feature)
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {}

    // Auto trigger toast
    addToast(newNotif.title, newNotif.message, newNotif.type);
  }, []);

  const addToast = useCallback((title, message, type = "system") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove toast after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addAnnouncement = useCallback((announcement) => {
    const newAnnounce = {
      ...announcement,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnnounce, ...prev]);
    addNotification({
      type: "promotional",
      title: announcement.title,
      message: announcement.message,
    });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        announcements,
        addNotification,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addAnnouncement,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
