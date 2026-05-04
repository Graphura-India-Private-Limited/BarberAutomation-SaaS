import React, { useState } from "react";
import { AlertCircle, Circle, Coffee, Power } from "lucide-react";
import { useBarberStatus } from "../context/StatusContext";

const OPTIONS = [
    { value: "Available", label: "Available", icon: Circle, color: "emerald" },
    { value: "Busy", label: "Busy", icon: AlertCircle, color: "red" },
    { value: "On Break", label: "On Break", icon: Coffee, color: "amber" },
    { value: "Offline", label: "Offline", icon: Power, color: "slate" },
];

export default function StatusToggle() {
    const { status, manualSetStatus, canChangeTo } = useBarberStatus();
    const [pendingStatus, setPendingStatus] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const openConfirm = (nextStatus) => {
        const check = canChangeTo(nextStatus);
        if (!check.allowed) {
            setModalMessage(check.message);
            setPendingStatus(null);
            setModalVisible(true);
            return;
        }
        setPendingStatus(nextStatus);
        setModalMessage(`Are you sure you want to change status to ${nextStatus}?`);
        setModalVisible(true);
    };

    const confirmChange = () => {
        if (pendingStatus) {
            manualSetStatus(pendingStatus);
        }
        setModalVisible(false);
        setPendingStatus(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-sm w-fit">
                {OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = status === option.value;
                    const activeClasses = {
                        emerald: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
                        red: "bg-red-500 text-white shadow-md shadow-red-500/20",
                        amber: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
                        slate: "bg-slate-500 text-white shadow-md shadow-slate-500/20",
                    };
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => option.value !== status && openConfirm(option.value)}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none ${active ? activeClasses[option.color] : "border-transparent bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                                }`}
                        >
                            <Icon size={12} strokeWidth={2.5} />
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {modalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Confirm status change</h2>
                        <p className="mt-3 text-sm text-slate-600">{modalMessage}</p>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={confirmChange}
                                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Yes, update status
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setModalVisible(false);
                                    setPendingStatus(null);
                                }}
                                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
