import React, { useEffect, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function AdminActivityTracker() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const isTimeoutEnabled = localStorage.getItem("security_sessionTimeout") !== "false";
    if (!isTimeoutEnabled) return;

    // Inactivity timeout: 30 minutes (1,800,000 milliseconds)
    timeoutRef.current = setTimeout(() => {
      localStorage.clear();
      navigate("/admin/login");
    }, 1800000);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    
    // Initialize session timer
    resetTimeout();

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return <Outlet />;
}
