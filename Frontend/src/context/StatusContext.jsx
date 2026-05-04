import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STATUS_CONFIG = {
    Available: {
        key: "Available",
        label: "Available",
        dot: "🟢",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    Busy: {
        key: "Busy",
        label: "Busy",
        dot: "🔴",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
    },
    "On Break": {
        key: "On Break",
        label: "On Break",
        dot: "🟡",
        badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    },
    Offline: {
        key: "Offline",
        label: "Offline",
        dot: "⚫",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    },
};

const StatusContext = createContext(null);

export function StatusProvider({ children }) {
    const [status, setStatus] = useState("Available");
    const [serviceActive, setServiceActive] = useState(false);
    const [toast, setToast] = useState("");
    const [breakEndsAt, setBreakEndsAt] = useState(null);

    useEffect(() => {
        if (!toast) return undefined;
        const timeoutId = window.setTimeout(() => setToast(""), 2600);
        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    useEffect(() => {
        if (status !== "Available" || serviceActive || breakEndsAt) return undefined;

        const timerId = window.setTimeout(() => {
            setStatus("On Break");
            setBreakEndsAt(Date.now() + 18000);
            setToast("Scheduled break started");
        }, 25000);

        return () => window.clearTimeout(timerId);
    }, [status, serviceActive, breakEndsAt]);

    useEffect(() => {
        if (status !== "On Break" || !breakEndsAt) return undefined;

        const remaining = Math.max(0, breakEndsAt - Date.now());
        const timerId = window.setTimeout(() => {
            setStatus("Available");
            setBreakEndsAt(null);
            setToast("Break ended. Now Available");
        }, remaining);

        return () => window.clearTimeout(timerId);
    }, [status, breakEndsAt]);

    const startService = () => {
        setServiceActive(true);
        setStatus("Busy");
        setBreakEndsAt(null);
        setToast("Status updated to Busy");
    };

    const completeService = () => {
        setServiceActive(false);
        setStatus("Available");
        setBreakEndsAt(null);
        setToast("Now Available");
    };

    const manualSetStatus = (nextStatus) => {
        setServiceActive(nextStatus === "Busy");
        setStatus(nextStatus);
        if (nextStatus !== "Busy") {
            setBreakEndsAt(null);
        }
        setToast(`Status updated to ${nextStatus}`);
    };

    const canChangeTo = (nextStatus) => {
        if (status === "Busy" && nextStatus === "Available" && serviceActive) {
            return {
                allowed: false,
                message: "Service is active. Complete the appointment before moving to Available.",
            };
        }
        return { allowed: true, message: "" };
    };

    const statusText = useMemo(() => {
        if (status === "Busy") return "Busy – Next slot in 20 mins";
        if (status === "On Break") {
            if (breakEndsAt) {
                const remainingMinutes = Math.max(0, Math.ceil((breakEndsAt - Date.now()) / 60000));
                return `On Break · Ends in ${remainingMinutes} min${remainingMinutes === 1 ? "" : "s"}`;
            }
            return "On Break";
        }
        if (status === "Offline") return "Offline";
        return "Barber is Available";
    }, [status, breakEndsAt]);

    const value = {
        status,
        statusText,
        serviceActive,
        isOffline: status === "Offline",
        isOnBreak: status === "On Break",
        isBusy: status === "Busy",
        statusConfig: STATUS_CONFIG,
        startService,
        completeService,
        manualSetStatus,
        canChangeTo,
        setToast,
        toast,
    };

    return (
        <StatusContext.Provider value={value}>
            {children}

            {toast && (
                <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-300">
                    <p className="text-sm font-semibold text-slate-900">{toast}</p>
                </div>
            )}
        </StatusContext.Provider>
    );
}

export function useBarberStatus() {
    const context = useContext(StatusContext);
    if (!context) {
        throw new Error("useBarberStatus must be used inside StatusProvider");
    }
    return context;
}
