import React from "react";

const badgeStyles = {
    Available: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Busy: "bg-red-100 text-red-800 border border-red-200",
    "On Break": "bg-amber-100 text-amber-900 border border-amber-200",
    Offline: "bg-slate-100 text-slate-700 border border-slate-200",
};

const labelMap = {
    Available: "Available",
    Busy: "Busy",
    "On Break": "On Break",
    Offline: "Offline",
};

export default function StatusBadge({ status, className = "", small }) {
    if (!status) return null;
    const normalized = String(status).trim();
    const badgeClass = badgeStyles[normalized] || badgeStyles.Available;
    const label = labelMap[normalized] || normalized;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${badgeClass} text-[11px] font-semibold ${className}`}
        >
            <span aria-hidden="true">{normalized === "Available" ? "🟢" : normalized === "Busy" ? "🔴" : normalized === "On Break" ? "🟡" : "⚫"}</span>
            <span>{label}</span>
        </span>
    );
}
