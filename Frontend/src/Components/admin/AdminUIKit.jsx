import React, { useMemo } from "react";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";

export function AdminGlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
      .admin-root { font-family: 'Inter', sans-serif; }
      .admin-root .font-serif { font-family: 'Cormorant Garamond', serif; }
      .admin-root ::-webkit-scrollbar { width: 6px; height: 6px; }
      .admin-root ::-webkit-scrollbar-thumb { background: #E7E5E4; border-radius: 10px; }
      .admin-root .card-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02); }
      .admin-root .inp { width: 100%; border: 1px solid #E7E5E4; border-radius: 8px; padding: 10px 14px; font-size: 13px; outline: none; transition: all 0.2s; background: #fff; box-sizing: border-box; }
      .admin-root .inp:focus { border-color: #C5A059; box-shadow: 0 0 0 3px rgba(197,160,89,0.1); }
      .admin-root button,
      .admin-root .cursor-pointer,
      .admin-root [role="button"] {
        transition: transform 0.15s ease, opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
      }
      .admin-root button:active,
      .admin-root .cursor-pointer:active,
      .admin-root [role="button"]:active {
        transform: scale(0.98);
        opacity: 0.92;
      }
      .admin-root .admin-tab-btn { transition: background 0.15s, color 0.15s; }
    `}</style>
  );
}

export const AdminPageShell = ({ children }) => (
  <div className="space-y-6 pb-8">{children}</div>
);

export const ADMIN_C = {
  bg: "#FAFAFA",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldLight: "#FDF9F3",
  brown: "#8B6B3E",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  green: "#059669",
  greenLight: "#ECFDF5",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  red: "#DC2626",
  redLight: "#FEF2F2",
  orange: "#D97706",
  orangeLight: "#FFFBEB",
};

export const PAGE_SIZE = 10;

export const AdminAvatar = ({ name, size = 36, color = ADMIN_C.gold, bg = ADMIN_C.goldLight, src }) => {
  if (src) return <img src={src} alt="" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.4, fontWeight: 700, color, flexShrink: 0, border: `1px solid ${color}30`,
      }}
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

export const StatusPill = ({ active, label }) => {
  const raw = label != null ? String(label) : (active ? "Active" : "Inactive");
  const lower = raw.toLowerCase();
  const isActive = active ?? ["active", "available", "completed", "captured", "approved", "confirmed"].includes(lower);
  const text = raw.charAt(0).toUpperCase() + raw.slice(1);
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold capitalize"
      style={{
        background: isActive ? "#ECFDF5" : "#FEF2F2",
        color: isActive ? "#047857" : "#B91C1C",
        border: `1px solid ${isActive ? "#A7F3D0" : "#FECACA"}`,
      }}
    >
      {text}
    </span>
  );
};

export const StatusBadge = ({ label, color }) => (
  <span
    className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
  >
    {label}
  </span>
);

export const StatCardsRow = ({ cards, loading }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {cards.map((card) => {
      const Icon = card.icon;
      return (
        <div key={card.label} className="bg-white rounded-xl border card-shadow p-6 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: ADMIN_C.border }}>
          <p className="text-[13px] font-medium" style={{ color: ADMIN_C.muted }}>{card.label}</p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <div className="text-2xl font-bold font-serif" style={{ color: ADMIN_C.ink }}>{loading ? "—" : card.value}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: card.iconBg }}>
              <Icon size={22} color={card.iconColor} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export const ActionToolbar = ({ search, onSearchChange, placeholder, addLabel, onAdd, showFilters = true }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
    <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 w-full sm:max-w-md" style={{ borderColor: ADMIN_C.border }}>
      <Search size={16} color={ADMIN_C.brown} />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full"
      />
    </div>
    {showFilters && (
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap"
        style={{ borderColor: ADMIN_C.border, color: ADMIN_C.ink }}
      >
        <Filter size={16} color={ADMIN_C.brown} />
        Filters
        <ChevronDown size={14} color={ADMIN_C.muted} />
      </button>
    )}
    {addLabel && (
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
        style={{ background: ADMIN_C.brown }}
      >
        <Plus size={16} />
        {addLabel}
      </button>
    )}
  </div>
);

export function usePagination(items, page, setPage, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(
    () => items.slice((pageSafe - 1) * pageSize, pageSafe * pageSize),
    [items, pageSafe, pageSize]
  );
  return { paged, pageSafe, totalPages, total: items.length };
}

export const TablePagination = ({ total, pageSafe, totalPages, onPrev, onNext }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t text-sm" style={{ borderColor: ADMIN_C.border, color: ADMIN_C.muted }}>
    <span>
      Showing {total === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1} to {Math.min(pageSafe * PAGE_SIZE, total)} of {total} results
    </span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pageSafe <= 1}
        onClick={onPrev}
        className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: ADMIN_C.border, background: "#fff", color: ADMIN_C.ink }}
      >
        Previous
      </button>
      <button type="button" className="min-w-[36px] px-3 py-2 rounded-md text-sm font-semibold text-white" style={{ background: ADMIN_C.brown }}>
        {pageSafe}
      </button>
      <button
        type="button"
        disabled={pageSafe >= totalPages || total === 0}
        onClick={onNext}
        className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: ADMIN_C.border, background: "#fff", color: ADMIN_C.ink }}
      >
        Next
      </button>
    </div>
  </div>
);

export const AdminDataTable = ({
  columns,
  loading,
  loadingText = "Loading…",
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptySubtitle,
  children,
  footer,
}) => (
  <div className="bg-white rounded-xl border card-shadow overflow-hidden" style={{ borderColor: ADMIN_C.border }}>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: ADMIN_C.border }}>
            {columns.map((col) => (
              <th key={col} className="px-6 py-4 text-[10px] font-bold tracking-wider" style={{ color: ADMIN_C.muted }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center text-sm" style={{ color: ADMIN_C.muted }}>
                {loadingText}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
    {footer}
  </div>
);

export const TableEmptyRow = ({ colSpan, icon: Icon, title, subtitle }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#F4E8D7" }}>
          <Icon size={32} color="#A66527" />
        </div>
        <div className="text-lg font-semibold" style={{ color: ADMIN_C.ink }}>{title}</div>
        <div className="mt-2 text-sm" style={{ color: ADMIN_C.muted }}>{subtitle}</div>
      </div>
    </td>
  </tr>
);

export function RowActionsMenu({ id, openId, setOpenId, items }) {
  return (
    <div className="flex items-center gap-1 relative">
      {items.map((item) =>
        item.icon ? (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className="p-2 rounded-md hover:bg-gray-50 transition-colors"
            style={{ color: ADMIN_C.muted }}
            title={item.label}
          >
            <item.icon size={18} />
          </button>
        ) : null
      )}
      {items.some((i) => i.menu) && (
        <>
          <button
            type="button"
            onClick={() => setOpenId(openId === id ? null : id)}
            className="p-2 rounded-md hover:bg-gray-50"
            style={{ color: ADMIN_C.muted }}
          >
            {items.find((i) => i.menu)?.menuTrigger}
          </button>
          {openId === id && items.filter((i) => i.menu).map((item) => (
            <div
              key={item.key}
              className="absolute right-0 top-full mt-1 z-10 min-w-[160px] rounded-md border bg-white py-1 shadow-lg"
              style={{ borderColor: ADMIN_C.border }}
            >
              {item.menu.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => { m.onClick(); setOpenId(null); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  style={{ color: ADMIN_C.ink }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
