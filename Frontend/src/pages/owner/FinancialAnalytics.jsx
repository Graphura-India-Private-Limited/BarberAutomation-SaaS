import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, financeData as contextFinanceData } from "../../contexts/AppContext";
import { 
  BadgeIndianRupee, CalendarDays, CircleDollarSign, ReceiptText, 
  TrendingUp, Scissors, LogOut, LayoutDashboard, BarChart2, CreditCard, DollarSign,
  Users, Clock, Activity, Star, UserX, Crown, Store, Layers, Coffee, HelpCircle,
  Calendar, IndianRupee, Settings
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const token = () => localStorage.getItem("token") || localStorage.getItem("ownerToken");

// ─── HIGH-FIDELITY LUXURY DUMMY DATA ENGINE (PORTED FROM REVENUE) ──────────────────
const DUMMY_DASHBOARD = {
  summary: {
    totalRevenue: 148200,
    tokenRevenue: 34500,
    fullRevenue: 113700
  },
  trends: [
    { date: "23 May", revenue: 12000 },
    { date: "24 May", revenue: 18500 },
    { date: "25 May", revenue: 14200 },
    { date: "26 May", revenue: 22400 },
    { date: "27 May", revenue: 19800 },
    { date: "28 May", revenue: 26500 },
    { date: "29 May", revenue: 34800 }
  ],
  services: [
    { serviceName: "Classic Haircut & Styling", revenue: 64000, transactions: 52 },
    { serviceName: "Premium Beard Sculpting", revenue: 32400, transactions: 36 },
    { serviceName: "Luxury Head Spa Massage", revenue: 28800, transactions: 18 },
    { serviceName: "Royal Shave Treatment", revenue: 14200, transactions: 20 },
    { serviceName: "Organic Hair Coloring", revenue: 8800, transactions: 4 }
  ],
  barbers: [
    { barberName: "Ali (Master Stylist)", revenue: 58400 },
    { barberName: "Ravi (Beard Expert)", revenue: 49200 },
    { barberName: "James (Color Specialist)", revenue: 40600 }
  ]
};

const DUMMY_DAILY = {
  totalRevenue: 34800
};

// ─── HIGH-FIDELITY LUXURY DUMMY DATA ENGINE (PORTED FROM FINANCE) ──────────────────
const fallbackFinanceData = {
  todayRevenue: 800,
  weekRevenue: 2060,
  monthRevenue: 5150,
  barberBreakdown: [
    { 
      name: "James (Color Specialist)", 
      generatedRevenue: 2600, 
      commissionRate: "15%", 
      payoutShare: 390,
      type: "COMMISSION" 
    },
    { 
      name: "Ravi (Beard Expert)", 
      generatedRevenue: 1600, 
      commissionRate: "15%", 
      payoutShare: 240,
      type: "COMMISSION" 
    },
    { 
      name: "Ali (Master Stylist)", 
      generatedRevenue: 950, 
      commissionRate: "15%", 
      payoutShare: 143,
      type: "COMMISSION" 
    }
  ],
  topServices: [
    { service: "Royal Shave Treatment", count: 7, revenue: 1750 },
    { service: "Luxury Head Spa Massage", count: 3, revenue: 1200 },
    { service: "Classic Haircut & Styling", count: 4, revenue: 1200 },
    { service: "Premium Beard Sculpting", count: 5, revenue: 1000 }
  ]
};

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token()}` } });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export default function FinancialAnalytics() {
  const navigate = useNavigate();
  const { currentUser, canViewFinance } = useAuth();
  
  // Tab selector state
  const [activeTab, setActiveTab] = useState("revenue"); // "revenue", "queue", "finance"
  
  // ─── REVENUE TAB STATES ───
  const [range, setRange] = useState({ from: "", to: "" });
  const [dashboard, setDashboard] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
  const [dbBarbers, setDbBarbers] = useState([]);
  const [dbSalons, setDbSalons] = useState([]);
  const [salonReports, setSalonReports] = useState([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // ─── QUEUE TAB STATES ───
  const [queueTabSub, setQueueTabSub] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('daily');
  const [reportType, setReportType] = useState('salon-wise');
  const [hoveredTrafficIdx, setHoveredTrafficIdx] = useState(null);
  const [hoveredQueueIdx, setHoveredQueueIdx] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiGet(`/payment/revenue/salon-breakdown?timeFilter=${timeFilter}`)
      .then(data => {
        if (data.reports) {
          setSalonReports(data.reports);
        }
      })
      .catch(err => console.error("Error fetching salon breakdown reports:", err));
  }, [timeFilter]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
    return params.toString();
  }, [range]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    
    Promise.all([
      apiGet(`/payment/revenue/dashboard${query ? `?${query}` : ""}`).catch(() => null),
      apiGet("/payment/revenue/daily").catch(() => null),
    ])
      .then(([nextDashboard, nextDaily]) => {
        if (!active) return;

        if (!nextDashboard || !nextDashboard.summary || nextDashboard.trends?.length === 0) {
          setDashboard(DUMMY_DASHBOARD);
        } else {
          setDashboard(nextDashboard);
        }

        if (!nextDaily || !nextDaily.revenue) {
          setDaily(DUMMY_DAILY);
        } else {
          setDaily(nextDaily.revenue);
        }
      })
      .catch(() => {
        if (active) {
          setDashboard(DUMMY_DASHBOARD);
          setDaily(DUMMY_DAILY);
        }
      })
      .finally(() => active && setLoading(false));
      
    return () => { active = false; };
  }, [query]);

  const salonId = localStorage.getItem("salonId") || "";

  useEffect(() => {
    if (!salonId) return;
    fetch(`${API}/barber/salon/${salonId}`, {
      headers: { Authorization: `Bearer ${token()}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.barbers) {
          setDbBarbers(data.barbers);
        }
      })
      .catch(err => console.error("Error fetching barbers for financials:", err));
  }, [salonId]);

  useEffect(() => {
    fetch(`${API}/salon`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.salons) {
          setDbSalons(data.salons);
        }
      })
      .catch(err => console.error("Error fetching salons for analytics:", err));
  }, []);

  // Derived revenue data
  const summary = dashboard?.summary || {};
  const trends = dashboard?.trends || [];
  const services = dashboard?.services || [];
  
  const barbers = useMemo(() => {
    if (dbBarbers.length === 0) {
      return dashboard?.barbers || [];
    }
    return dbBarbers.map((b, idx) => {
      const charSum = b.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const served = 5 + (charSum % 15);
      const revenueVal = served * 300 + (charSum % 10) * 50;
      return {
        barberName: b.name,
        revenue: revenueVal
      };
    });
  }, [dbBarbers, dashboard?.barbers]);

  // ─── QUEUE TAB STATIC DATA ───
  const trafficData = [
    { day: "Mon", val: 25 },
    { day: "Tue", val: 40 },
    { day: "Wed", val: 30 },
    { day: "Thu", val: 55 },
    { day: "Fri", val: 50 },
    { day: "Sat", val: 75 },
    { day: "Sun", val: 90 },
  ];

  const queueData = [
    { name: "Served", value: 45, color: GOLD },
    { name: "Waiting", value: 30, color: CHARCOAL },
    { name: "Delayed", value: 15, color: "#CBD5E1" },
    { name: "Drops", value: 10, color: "#EF4444" },
  ];

  const trafficWidth = 720;
  const trafficHeight = 220;
  const trafficPad = 20;
  const maxTraffic = 100;
  
  const trafficPoints = trafficData.map((item, index) => {
    const x = trafficPad + (index * (trafficWidth - trafficPad * 2)) / (trafficData.length - 1);
    const y = trafficHeight - trafficPad - (item.val / maxTraffic) * (trafficHeight - trafficPad * 2);
    return { x, y, day: item.day, val: item.val };
  });
  
  const trafficPointsStr = trafficPoints.map(p => `${p.x},${p.y}`).join(" ");
  const trafficRectWidth = (trafficWidth - trafficPad * 2) / (trafficData.length - 1);
  const areaPointsStr = `${trafficPad},${trafficHeight - trafficPad} ${trafficPointsStr} ${trafficWidth - trafficPad},${trafficHeight - trafficPad}`;

  const performanceMetrics = [
    { title: 'Total Customers', value: '1,245', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Active Queue', value: '12', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Avg Wait Time (per day)', value: '18 mins', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Peak Hours', value: '4PM - 6PM', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Average Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Total Revenue (per day)', value: '₹48,500', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Drop-offs', value: '14', icon: UserX, color: 'text-red-600', bg: 'bg-red-50 border border-red-200/50' },
    { title: 'Staff Active', value: '6', icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
  ];

  const barberAnalytics = useMemo(() => {
    if (dbBarbers.length === 0) {
      return [
        { id: "1", name: 'Ali (Master Stylist)', served: 15, rating: 4.9, efficiency: 95, revenue: '₹4,500' },
        { id: "2", name: 'Ravi (Beard Expert)', served: 12, rating: 4.7, efficiency: 88, revenue: '₹3,200' },
      ];
    }
    return dbBarbers.map((b, idx) => {
      const charSum = b.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const served = 5 + (charSum % 15);
      const rating = (4.5 + ((charSum % 6) * 0.1)).toFixed(1);
      const efficiency = 80 + (charSum % 19);
      const revenueVal = served * 300 + (charSum % 10) * 50;
      return {
        id: b._id || String(idx),
        name: b.name,
        served,
        rating: Number(rating),
        efficiency,
        revenue: `₹${revenueVal.toLocaleString("en-IN")}`
      };
    });
  }, [dbBarbers]);

  const topSalons = useMemo(() => {
    const defaultVal = { name: "Loading...", customers: 0, revenue: 0, delayAvg: "0 mins" };
    if (!salonReports || salonReports.length === 0) {
      return {
        leastDelay: defaultVal,
        mostCustomers: defaultVal,
        highestRevenue: defaultVal,
      };
    }
    return {
      leastDelay: [...salonReports].sort((a, b) => parseInt(a.delayAvg) - parseInt(b.delayAvg))[0] || defaultVal,
      mostCustomers: [...salonReports].sort((a, b) => b.customers - a.customers)[0] || defaultVal,
      highestRevenue: [...salonReports].sort((a, b) => b.revenue - a.revenue)[0] || defaultVal,
    };
  }, [salonReports]);

  const displayData = useMemo(() => {
    let reports = [...salonReports];
    if (reportType === 'revenue-wise') {
      reports.sort((a, b) => b.revenue - a.revenue);
    } else if (reportType === 'booking-wise') {
      reports.sort((a, b) => b.bookings - a.bookings);
    } else {
      reports.sort((a, b) => a.name.localeCompare(b.name));
    }
    return reports;
  }, [reportType, salonReports]);


  // Builds the exportable dataset for whichever tab/sub-view is currently active,
  // so the header-level Export CSV button always reflects what's on screen.
  const getActiveExportPayload = () => {
    if (activeTab === "revenue") {
      return {
        filenamePrefix: "revenue-streams",
        headers: ["Date", "Revenue (INR)"],
        rows: trends.map(t => [t.date, t.revenue])
      };
    }
    if (activeTab === "queue") {
      if (queueTabSub === "overview") {
        return {
          filenamePrefix: "barber-performance-ledger",
          headers: ["Styling Specialist", "Served Today", "User Rating", "Revenue (INR)", "Efficiency Rate (%)"],
          rows: barberAnalytics.map(b => [b.name, b.served, b.rating, b.revenue, b.efficiency])
        };
      }
      return {
        filenamePrefix: `salon-telemetry-report-${timeFilter}-${reportType}`,
        headers: ["Active Salon Node", "Bookings", "Customers Served", "Avg Operational Delay", "Revenue Yield (INR)"],
        rows: displayData.map(s => [s.name, s.bookings, s.customers, s.delayAvg, s.revenue])
      };
    }
    if (activeTab === "finance") {
      return {
        filenamePrefix: "barber-earnings-breakdown",
        headers: ["Barber Name", "Type", "Generated Revenue (INR)", "Commission Rate", "Payout Share (INR)", "Monthly Salary (INR)"],
        rows: barberData.map(b => {
          const hasCustomFields = b.generatedRevenue !== undefined;
          const genRev = hasCustomFields ? b.generatedRevenue : b.today;
          const commRate = hasCustomFields ? b.commissionRate : b.commission;
          const payout = hasCustomFields ? b.payoutShare : b.earned;
          const badgeText = b.type || (commRate ? "COMMISSION" : "FIXED");
          return [b.name, badgeText, genRev ?? "", commRate ?? "", payout ?? "", b.salary ?? ""];
        })
      };
    }
    return { filenamePrefix: "export", headers: [], rows: [] };
  };

  const escapeCSVFieldHeader = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleHeaderExportCSV = () => {
    const { filenamePrefix, headers, rows } = getActiveExportPayload();
    if (!rows.length) return;

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map(row => row.map(escapeCSVFieldHeader).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenamePrefix}-${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeExportRowCount = getActiveExportPayload().rows.length;

  const handleExportCSV = () => {
    if (!displayData.length) return;
    const headers = ["Active Salon Node", "Bookings", "Customers Served", "Avg Operational Delay", "Revenue Yield"];
    const rows = displayData.map(salon => [
      `"${salon.name.replace(/"/g, '""')}"`,
      salon.bookings,
      salon.customers,
      `"${salon.delayAvg}"`,
      salon.revenue
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Salon_Telemetry_Report_${timeFilter}_${reportType}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (!displayData.length) return;
    let excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Salon Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
      <table>
        <thead>
          <tr>
            <th>Active Salon Node</th>
            <th>Bookings</th>
            <th>Customers Served</th>
            <th>Avg Operational Delay</th>
            <th>Revenue Yield</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    displayData.forEach(salon => {
      excelContent += `
        <tr>
          <td>${salon.name}</td>
          <td>${salon.bookings}</td>
          <td>${salon.customers}</td>
          <td>${salon.delayAvg}</td>
          <td>${salon.revenue}</td>
        </tr>
      `;
    });
    
    excelContent += `
        </tbody>
      </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Salon_Telemetry_Report_${timeFilter}_${reportType}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── FINANCE TAB STATES & CONFIGS ───
  const isOwner = currentUser?.role === "owner" || true; // Fallback for testing
  const hasContextData = contextFinanceData && (contextFinanceData.todayRevenue > 0 || contextFinanceData.barberBreakdown?.length > 0);
  
  const activeFinance = useMemo(() => {
    const rawFinance = hasContextData ? contextFinanceData : fallbackFinanceData;
    if (dbBarbers.length === 0) {
      return rawFinance;
    }
    
    const mappedBreakdown = dbBarbers.map((b, idx) => {
      const charSum = b.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const isCommission = charSum % 2 === 0;
      const todayRevenueVal = 1000 + (charSum % 15) * 100;
      if (isCommission) {
        return {
          name: b.name,
          today: todayRevenueVal,
          commission: "30%",
          earned: Math.round(todayRevenueVal * 0.3),
          type: "COMMISSION"
        };
      } else {
        return {
          name: b.name,
          today: todayRevenueVal,
          salary: 15000 + (charSum % 5) * 1000,
          type: "Fixed"
        };
      }
    });

    return {
      ...rawFinance,
      barberBreakdown: mappedBreakdown
    };
  }, [dbBarbers, hasContextData]);

  const barberData = useMemo(() => {
    return isOwner
      ? (activeFinance.barberBreakdown || [])
      : (activeFinance.barberBreakdown || []).filter(b => b.name?.includes(currentUser?.name || ""));
  }, [activeFinance, isOwner, currentUser]);

  const showRestrictedFinance = canViewFinance && !canViewFinance();

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADBCE;
          border-radius: 10px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        
        {/* TIMING CONTROL METADATA BANNER */}
        {/* <div className="flex justify-between items-center mb-4 font-sans text-left"> */}
          {/* Header Title */}
          {/* <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Live Clock: <span className="text-stone-800 font-mono tracking-normal">{time} IST</span></span>
          </div>
        </div> */}
        {/* TIMING CONTROL METADATA BANNER */}
        <div className="flex justify-between items-center mb-4 font-sans text-left gap-3">
          {/* Header Title */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Live Clock: <span className="text-stone-800 font-mono tracking-normal">{time} IST</span></span>
          </div>

          {/* Header-level Export CSV — exports whatever the active tab is currently showing */}
          <button
            onClick={handleHeaderExportCSV}
            disabled={!activeExportRowCount}
            title={!activeExportRowCount ? "No data available to export" : "Export the current view as CSV"}
            className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] hover:bg-[#8B5A2B]/5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            {activeExportRowCount ? "Export CSV" : "No Data To Export"}
          </button>
        </div>

        {/* Premium Brand Header Banner */}
        <div className="rounded-3xl p-6 md:p-8 mb-8 overflow-hidden card relative bg-white text-left">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
                Unified Business Intelligence
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
                <span className="font-bold uppercase">Financial</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Analytics</span>
              </h2>
              <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Track real-time merchant settlement streams, staff efficiency, and earnings payouts.</p>
            </div>
            
            {/* Range picker only visible on revenue tab */}
            {activeTab === "revenue" && (
              <div className="flex flex-col sm:flex-row gap-4 bg-stone-50 border border-[#EADBCE] p-4 rounded-3xl w-full lg:max-w-md shrink-0 sm:items-center shadow-inner font-sans">
                <div className="flex-1 w-full">
                  <DateInput label="From" value={range.from} onChange={value => setRange(prev => ({ ...prev, from: value }))} />
                </div>
                <div className="hidden sm:block h-6 w-px bg-stone-300 mt-5 shrink-0" />
                <div className="flex-1 w-full">
                  <DateInput label="To" value={range.to} onChange={value => setRange(prev => ({ ...prev, to: value }))} />
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
            <TrendingUp className="w-32 h-32 text-stone-900" />
          </div>
        </div>

        {/* Unified Tab Sub-Navbar */}
        <div className="rounded-3xl p-2 mb-8 bg-[#8B5A2B]/5 border border-[#8B5A2B]/10 flex flex-wrap gap-2 shadow-inner font-sans max-w-lg">
          {['revenue', 'queue', 'finance'].map((tab) => {
            const labels = {
              revenue: "Revenue Streams",
              queue: "Queue Analytics",
              finance: "Finance & Payouts"
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border-none ${
                  isActive
                    ? "bg-[#3E362E] text-white shadow-md"
                    : "text-[#8B5A2B] hover:bg-[#8B5A2B]/5 font-extrabold bg-transparent"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* loading state */}
        {loading && activeTab === "revenue" ? (
          <DashboardSkeleton />
        ) : error && activeTab === "revenue" ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700 card hover:transform-none font-sans text-left">{error}</div>
        ) : (
          <div>
            
            {/* ── TAB 1: REVENUE STREAMS ── */}
            {activeTab === "revenue" && (
              <div className="animate-in fade-in duration-300 space-y-8">
                {/* Metric Summary counters */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
                  <MetricCard title="Daily Revenue" value={money(daily?.totalRevenue ?? daily)} icon={CalendarDays} accent="bg-orange-50 border border-orange-200/50 text-orange-700" />
                  <MetricCard title="Total Revenue" value={money(summary.totalRevenue)} icon={BadgeIndianRupee} accent="bg-amber-50 border border-amber-200/55 text-amber-700" />
                  <MetricCard title="Token Payments" value={money(summary.tokenRevenue)} icon={ReceiptText} accent="bg-sky-50 border border-sky-200/50 text-sky-700" />
                  <MetricCard title="Full Payments" value={money(summary.fullRevenue)} icon={CircleDollarSign} accent="bg-emerald-50 border border-emerald-200/50 text-emerald-700" />
                </section>

                {/* Line Trend chart */}
                <section className="space-y-6">
                  <ChartPanel title="Daily Revenue Graph" subtitle="Revenue trend compiled from successful payments matrix. animate-in fade-in" className="w-full">
                    <div className="w-full h-full pt-2">
                      <LineChart data={trends} />
                    </div>
                  </ChartPanel>

                  {/* Splits: service & barber */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartPanel title="Service Revenue" subtitle="Share split breakdown ratio partitioned by catalog product items.">
                      <PieChart data={services.map(item => ({ name: item.serviceName, value: item.revenue }))} />
                    </ChartPanel>
                    <ChartPanel title="Barber Performance" subtitle="Revenue distribution profiles generated across active salon barber nodes.">
                      <BarChart data={barbers.map(item => ({ name: item.barberName, value: item.revenue }))} />
                    </ChartPanel>
                  </div>
                </section>
              </div>
            )}

            {/* ── TAB 2: QUEUE & TRAFFIC ANALYTICS ── */}
            {activeTab === "queue" && (
              <div className="animate-in fade-in duration-300 space-y-8">
                
                {/* Selector categories */}
                <div className="rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-5 card bg-white text-left">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">Telemetry Views</h3>
                    <p className="text-xs text-stone-500">Toggle between queue pipeline overview and detailed franchise reports.</p>
                  </div>
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 self-start md:self-auto font-sans">
                    <button 
                      onClick={() => setQueueTabSub('overview')}
                      className="px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm focus:outline-none cursor-pointer border-none"
                      style={{ 
                        backgroundColor: queueTabSub === 'overview' ? CHARCOAL : 'transparent',
                        color: queueTabSub === 'overview' ? '#FFFFFF' : '#78716C'
                      }}
                    >
                      Salon Overview
                    </button>
                    <button 
                      onClick={() => setQueueTabSub('reports')}
                      className="px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm focus:outline-none cursor-pointer border-none"
                      style={{ 
                        backgroundColor: queueTabSub === 'reports' ? CHARCOAL : 'transparent',
                        color: queueTabSub === 'reports' ? '#FFFFFF' : '#78716C'
                      }}
                    >
                      System Reports
                    </button>
                  </div>
                </div>

                {queueTabSub === 'overview' ? (
                  <>
                    {/* Performance metrics grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                      {performanceMetrics.map((metric, index) => (
                        <div key={index} className="card p-5 flex items-center gap-4 bg-white">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${metric.bg}`}>
                            <metric.icon className={`w-5 h-5 ${metric.color}`} strokeWidth={2} />
                          </div>
                          <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">{metric.title}</p>
                            <h3 className="text-xl font-black text-stone-900 font-serif leading-tight">{metric.value}</h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Traffic trends and queue donut charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                      <div className="card p-6 lg:col-span-2 flex flex-col justify-between bg-white">
                        <div className="mb-6">
                          <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2">
                            <span className="font-bold uppercase">Queue & Traffic</span>
                            <span className="italic text-[#C5A059] normal-case font-medium">Trend</span>
                          </h2>
                          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Daily customer traffic index logs and active wait times breakdown.</p>
                        </div>
                        
                        <div className="relative h-60 w-full pl-8 pr-2 mb-6 font-sans">
                          <div className="absolute inset-0 pl-8 pr-2 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div key={i} className="w-full h-px relative flex items-center border-dashed border-t border-stone-200/60 animate-none">
                                <span className="absolute -left-8 text-[9px] font-bold font-mono text-stone-400">{(4-i) * 25}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="absolute bottom-0 left-8 right-2 translate-y-5 flex justify-between text-[10px] font-bold font-mono text-stone-400 pointer-events-none">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                          </div>

                          <div className="absolute inset-0 left-8 pr-2 pb-px pt-2">
                            <svg viewBox={`0 0 ${trafficWidth} ${trafficHeight}`} className="w-full h-full overflow-visible">
                              <defs>
                                <linearGradient id="orange-gradient-unified" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor={GOLD} stopOpacity="0.4" />
                                  <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              
                              <polygon points={areaPointsStr} fill="url(#orange-gradient-unified)" />
                              <polyline points={trafficPointsStr} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              
                              {hoveredTrafficIdx !== null && (
                                <line 
                                  x1={trafficPoints[hoveredTrafficIdx].x} 
                                  y1={trafficPad} 
                                  x2={trafficPoints[hoveredTrafficIdx].x} 
                                  y2={trafficHeight - trafficPad} 
                                  stroke="#8B5A2B" 
                                  strokeWidth="1.5" 
                                  strokeDasharray="3,3" 
                                  opacity="0.8" 
                                />
                              )}
                              
                              {trafficPoints.map((p, index) => (
                                <circle 
                                  key={p.day} 
                                  cx={p.x} 
                                  cy={p.y} 
                                  r={hoveredTrafficIdx === index ? "6" : "4"} 
                                  fill={hoveredTrafficIdx === index ? "#8B5A2B" : GOLD} 
                                  stroke="#ffffff" 
                                  strokeWidth="2" 
                                  style={{ transition: "all 0.15s ease" }}
                                />
                              ))}
                              
                              {trafficPoints.map((p, index) => {
                                const rectX = index === 0 ? p.x : p.x - trafficRectWidth / 2;
                                const currentWidth = (index === 0 || index === trafficData.length - 1) ? trafficRectWidth / 2 : trafficRectWidth;
                                return (
                                  <rect
                                    key={index}
                                    x={rectX}
                                    y={trafficPad}
                                    width={currentWidth}
                                    height={trafficHeight - trafficPad * 2}
                                    fill="transparent"
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={() => setHoveredTrafficIdx(index)}
                                    onMouseLeave={() => setHoveredTrafficIdx(null)}
                                  />
                                );
                              })}
                            </svg>
                            
                            {hoveredTrafficIdx !== null && (
                              <div 
                                className="absolute bg-zinc-900/95 text-[#FAF6F0] px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border border-[#C5A059]/40 pointer-events-none transition-all duration-150 z-20"
                                style={{
                                  left: `${(trafficPoints[hoveredTrafficIdx].x / trafficWidth) * 100}%`,
                                  top: `${(trafficPoints[hoveredTrafficIdx].y / trafficHeight) * 100}%`,
                                  transform: 'translate(-50%, -125%)',
                                }}
                              >
                                <p className="text-[#C5A059] uppercase tracking-wider mb-0.5">{trafficPoints[hoveredTrafficIdx].day}</p>
                                <p className="text-white font-mono font-extrabold text-xs">Traffic: {trafficPoints[hoveredTrafficIdx].val}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-center items-center gap-2 mt-4 pt-2 border-t border-stone-100">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }}></div>
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Customer Traffic Analytics Ledger</span>
                        </div>
                      </div>

                      <div className="card p-6 flex flex-col justify-between bg-white">
                        <div>
                          <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2">
                            <span className="font-bold uppercase">Queue</span>
                            <span className="italic text-[#C5A059] normal-case font-medium">Breakdown</span>
                          </h2>
                          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Current execution allocation status of daily visitors pool.</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center my-auto py-4 font-sans">
                          {(() => {
                            let queueOffset = 0;
                            return (
                              <svg viewBox="0 0 42 42" className="h-44 w-44 shadow-sm rounded-full overflow-visible">
                                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FAF6F0" strokeWidth="6" />
                                <g transform="rotate(-90 21 21)">
                                  {queueData.map((item, index) => {
                                    const percent = item.value;
                                    const isHovered = hoveredQueueIdx === index;
                                    const segment = (
                                      <circle 
                                        key={item.name} 
                                        cx="21" 
                                        cy="21" 
                                        r="15.915" 
                                        fill="transparent" 
                                        stroke={item.color} 
                                        strokeWidth={isHovered ? "7.5" : "6"} 
                                        strokeDasharray={`${percent} ${100 - percent}`} 
                                        strokeDashoffset={-queueOffset}
                                        style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                                        onMouseEnter={() => setHoveredQueueIdx(index)}
                                        onMouseLeave={() => setHoveredQueueIdx(null)}
                                      />
                                    );
                                    queueOffset += percent;
                                    return segment;
                                  })}
                                </g>

                                {hoveredQueueIdx !== null ? (
                                  <>
                                    <text x="21" y="18.5" textAnchor="middle" fontSize="3" fontWeight="800" fill="#3E362E" className="font-sans font-bold">
                                      {queueData[hoveredQueueIdx].name}
                                    </text>
                                    <text x="21" y="23" textAnchor="middle" fontSize="4.5" fontWeight="950" fill={queueData[hoveredQueueIdx].color} className="font-mono">
                                      {queueData[hoveredQueueIdx].value}%
                                    </text>
                                    <text x="21" y="26.5" textAnchor="middle" fontSize="2" fontWeight="800" fill="#A89E95" className="font-sans uppercase tracking-wider">
                                      of visitor pool
                                    </text>
                                  </>
                                ) : (
                                  <>
                                    <text x="21" y="19" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#3E362E" className="font-serif">
                                      Queue
                                    </text>
                                    <text x="21" y="23.5" textAnchor="middle" fontSize="3" fontWeight="950" fill="#8B5A2B" className="font-mono">
                                      12 Active
                                    </text>
                                    <text x="21" y="26.5" textAnchor="middle" fontSize="1.8" fontWeight="800" fill="#A89E95" className="font-sans uppercase tracking-wider">
                                      hover for %
                                    </text>
                                  </>
                                )}
                              </svg>
                            );
                          })()}
                        </div>
                        
                        <div className="w-full flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
                          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }}></div> Served</div>
                          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHARCOAL }}></div> Waiting</div>
                          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Delayed</div>
                          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Drops</div>
                        </div>
                      </div>
                    </div>

                    {/* Barber Ledger */}
                    <div className="card p-6 bg-white text-left">
                      <div className="mb-5">
                        <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2">
                          <span className="font-bold uppercase">Barber Performance</span>
                          <span className="italic text-[#C5A059] normal-case font-medium">Ledger</span>
                        </h2>
                        <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Customers served, efficiency metrics track logs, and real-time revenue shares.</p>
                      </div>

                      <div className="overflow-x-auto custom-scrollbar font-sans">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-stone-100">
                              <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Styling Specialist</th>
                              <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Served Today</th>
                              <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">User Rating</th>
                              <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue</th>
                              <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-8 w-1/3">Efficiency Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-50">
                            {barberAnalytics.map((barber) => (
                              <tr key={barber.id} className="hover:bg-stone-50/40 transition-colors group">
                                <td className="py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-black text-xs font-serif shadow-sm">
                                      {barber.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-stone-900 text-sm tracking-tight">{barber.name}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 text-center font-mono font-bold text-stone-800 text-sm">{barber.served}</td>
                                <td className="py-3.5 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="font-bold text-stone-800 text-xs">{barber.rating}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 text-right font-mono font-bold text-stone-900 text-sm">{barber.revenue}</td>
                                <td className="py-3.5 pl-8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                      <div className="h-full rounded-full transition-all" style={{ width: `${barber.efficiency}%`, backgroundColor: GOLD }}></div>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-stone-500 w-8 text-right shrink-0">{barber.efficiency}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  /* TELEMETRY REPORTS VIEW */
                  <div className="space-y-6 text-left">
                    <div className="card p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm bg-white font-sans">
                      
                      <div className="flex flex-wrap justify-center sm:justify-start bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full lg:w-auto shadow-inner">
                        {['daily', 'weekly', 'monthly', 'yearly'].map(t => (
                          <button
                            key={t}
                            onClick={() => setTimeFilter(t)}
                            className="flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm border focus:outline-none cursor-pointer font-sans border-none"
                            style={{ 
                              backgroundColor: timeFilter === t ? '#FFFFFF' : 'transparent',
                              color: timeFilter === t ? CHARCOAL : '#78716C',
                              borderColor: timeFilter === t ? '#EADBCE' : 'transparent'
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full lg:w-auto shadow-inner">
                        {['salon-wise', 'revenue-wise', 'booking-wise'].map(type => (
                          <button
                            key={type}
                            onClick={() => setReportType(type)}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer border-none"
                            style={{ 
                              backgroundColor: reportType === type ? CHARCOAL : 'transparent',
                              color: reportType === type ? '#FFFBF2' : '#78716C'
                            }}
                          >
                            {type.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2">
                        <span className="font-bold uppercase">Top Performing</span>
                        <span className="italic text-[#C5A059] normal-case font-medium">Outlets</span>
                      </h2>
                      <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Highlighted tracking metrics displaying core performance indexes per branch node.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50/50 to-white rounded-2xl p-5 border border-green-200/50 relative overflow-hidden card">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-12 h-12 text-green-700" /></div>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-700 mb-2 font-sans">Minimum Waiting Lag</p>
                        <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.leastDelay.name}</h4>
                        <div className="flex items-baseline gap-1.5 font-sans">
                          <span className="text-2xl font-mono font-black text-green-700 leading-none">{topSalons.leastDelay.delayAvg}</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">delay index</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-5 border border-blue-200/50 relative overflow-hidden card">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-12 h-12 text-blue-700" /></div>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700 mb-2 font-sans">Highest Traffic Volume</p>
                        <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.mostCustomers.name}</h4>
                        <div className="flex items-baseline gap-1.5 font-sans">
                          <span className="text-2xl font-mono font-black text-blue-700 leading-none">{topSalons.mostCustomers.customers}</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">visitors today</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-2xl p-5 border border-amber-200/50 relative overflow-hidden card">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-12 h-12 text-amber-600" /></div>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 mb-2 font-sans">Peak Revenue Released</p>
                        <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.highestRevenue.name}</h4>
                        <div className="flex items-baseline gap-1.5 font-sans">
                          <span className="text-2xl font-mono font-black text-amber-700 leading-none">₹{topSalons.highestRevenue.revenue.toLocaleString()}</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">gross income</span>
                        </div>
                      </div>
                    </div>

                    {/* Excel Sheet Table */}
                    <div className="card overflow-hidden bg-white">
                      <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                        <div>
                          <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2">
                            <span className="font-bold uppercase">{reportType.replace('-', ' ')}</span>
                            <span className="italic text-[#C5A059] normal-case font-medium">Breakdown Report</span>
                          </h2>
                          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Detailed structural matrix audit metrics across active franchise coordinates logs ({timeFilter})</p>
                        </div>
                        <div className="relative font-sans" ref={exportDropdownRef}>
                          <button 
                            type="button"
                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                            className="rounded-xl border h-10 px-4 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans border-none"
                            style={{ backgroundColor: `${GOLD}10`, color: GOLD, borderColor: `${GOLD}40` }}
                            onMouseEnter={(e) => {
                              if (!exportDropdownOpen) {
                                e.currentTarget.style.backgroundColor = GOLD;
                                e.currentTarget.style.color = '#FFFFFF';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!exportDropdownOpen) {
                                e.currentTarget.style.backgroundColor = `${GOLD}10`;
                                e.currentTarget.style.color = GOLD;
                              }
                            }}
                          >
                            Export Report ↓
                          </button>
                          {exportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden font-sans">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleExportCSV();
                                    setExportDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors border-none bg-transparent cursor-pointer"
                                >
                                  Export as CSV
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleExportExcel();
                                    setExportDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors border-none bg-transparent cursor-pointer"
                                >
                                  Export as Excel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto custom-scrollbar font-sans">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-stone-50/50 border-b border-stone-100">
                              <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Active Salon Node</th>
                              <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Bookings</th>
                              <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Customers Served</th>
                              <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Avg Operational Delay</th>
                              <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue Yield</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-50">
                            {displayData.map((salon) => (
                              <tr key={salon.id} className="hover:bg-stone-50/30 transition-colors">
                                <td className="py-4 px-6 font-bold text-stone-900 text-sm font-serif tracking-tight">{salon.name}</td>
                                <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{salon.bookings}</td>
                                <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{salon.customers}</td>
                                <td className="py-4 px-6 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${parseInt(salon.delayAvg) > 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                    {salon.delayAvg}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right font-mono font-bold text-stone-900 text-sm">₹{salon.revenue.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="bg-stone-100/50 font-bold border-t-2 border-stone-200 text-stone-900 text-sm">
                              <td className="py-4 px-6 font-black uppercase tracking-wide text-xs">Total Cumulative Pipeline</td>
                              <td className="py-4 px-6 text-center font-mono font-black">{displayData.reduce((acc, curr) => acc + curr.bookings, 0)}</td>
                              <td className="py-4 px-6 text-center font-mono font-black">{displayData.reduce((acc, curr) => acc + curr.customers, 0)}</td>
                              <td className="py-4 px-6 text-center text-stone-400 font-mono font-medium">—</td>
                              <td className="py-4 px-6 text-right font-mono font-black text-amber-700">
                                ₹{displayData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: FINANCE & PAYOUTS ── */}
            {activeTab === "finance" && (
              <div className="animate-in fade-in duration-300 space-y-8">
                {showRestrictedFinance ? (
                  <div className="max-w-xl mx-auto py-16 text-center">
                    <div className="card p-10 bg-white">
                      <span className="text-5xl block mb-4">🔒</span>
                      <h2 className="text-2xl font-bold text-stone-900 font-serif mb-2">Access Restricted</h2>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        Financial data is not visible for your account tier. Contact the salon owner if you believe this is a system configuration mismatch.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Finance indicators */}
                    {isOwner && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                        <StatCard label="TODAY'S REVENUE" value={`₹${(activeFinance.todayRevenue || 0).toLocaleString()}`} />
                        <StatCard label="ESTIMATED WEEKLY" value={`₹${(activeFinance.weekRevenue || 0).toLocaleString()}`} />
                        <StatCard label="TOTAL CAPTURED (MONTH)" value={`₹${(activeFinance.monthRevenue || 0).toLocaleString()}`} />
                      </div>
                    )}

                    {/* Breakdown lists */}
                    <div className="grid md:grid-cols-12 gap-6 text-left">
                      <div className="card p-6 bg-white md:col-span-7">
                        <h3 className="font-serif text-xl font-bold text-stone-900 mb-5 border-b pb-3 border-stone-100 uppercase tracking-tight">
                          Barber Earnings Breakdown
                        </h3>
                        <div className="space-y-4">
                          {barberData.map((b, i) => {
                            const hasCustomFields = b.generatedRevenue !== undefined;
                            const genRev = hasCustomFields ? b.generatedRevenue : b.today;
                            const commRate = hasCustomFields ? b.commissionRate : b.commission;
                            const payout = hasCustomFields ? b.payoutShare : b.earned;
                            const badgeText = b.type || (commRate ? "COMMISSION" : "FIXED");

                            return (
                              <div key={i} className="bg-[#FAF6F0]/60 border border-[#EADBCE]/35 rounded-2xl p-5 transition-all duration-200 hover:bg-[#FAF6F0]/80">
                                <div className="flex justify-between items-center mb-3.5">
                                  <span className="font-black text-stone-900 text-sm tracking-tight font-serif">{b.name}</span>
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-[#8B5A2B] border border-amber-200/50 px-2.5 py-0.5 rounded">
                                    {badgeText}
                                  </span>
                                </div>
                                <div className="text-xs text-stone-600 space-y-1.5 font-medium font-sans">
                                  <p>Generated Revenue: <strong className="text-stone-900 font-extrabold">₹{(genRev || 0).toLocaleString()}</strong></p>
                                  {commRate && <p>Commission Rate: <strong className="text-stone-900 font-extrabold">{commRate}</strong></p>}
                                  {payout !== undefined && <p>Payout Share: <strong className="text-emerald-700 font-extrabold">₹{(payout || 0).toLocaleString()}</strong></p>}
                                  {b.salary && <p>Monthly Salary: <strong className="text-stone-900 font-extrabold">₹{(b.salary || 0).toLocaleString()}</strong></p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {isOwner && (
                        <div className="card p-6 bg-white md:col-span-5">
                          <h3 className="font-serif text-xl font-bold text-stone-900 mb-5 border-b pb-3 border-stone-100 uppercase tracking-tight">
                            Top Performing Services
                          </h3>
                          <div className="space-y-3">
                            {(activeFinance.topServices || []).map((s, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#FAF6F0]/60 border border-[#EADBCE]/35 rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-[#FAF6F0]/80">
                                <div className="text-left">
                                  <p className="font-black text-stone-950 text-xs tracking-tight">{s.service}</p>
                                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1 font-sans">{s.count} sessions</p>
                                </div>
                                <span className="font-bold text-stone-900 font-serif text-sm">₹{(s.revenue || 0).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// ─── REVENUE SUB-COMPONENTS ───
function DateInput({ label, value, onChange }) {
  return (
    <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] w-full text-left font-sans">
      {label}
      <input 
        type="date" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="mt-1 w-full bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer focus:text-[#C5A059] font-sans border-none" 
      />
    </label>
  );
}

function MetricCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="card p-5 flex items-center gap-4 bg-white shadow-sm text-left">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">{title}</p>
        <h3 className="text-xl font-black text-stone-900 font-serif leading-none truncate">{value}</h3>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-6 bg-white shadow-sm ${className} text-left`}>
      <div className="mb-6">
        <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
          <span className="font-bold uppercase">{title.split(" ")[0]}</span>
          <span className="italic text-[#C5A059] normal-case font-medium">{title.split(" ").slice(1).join(" ")}</span>
        </h2>
        <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function LineChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const width = 720;
  const height = 260;
  const pad = 28;

  const max = Math.max(...data.map(item => item.revenue || 0), 1);
  const points = data.map((item, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(data.length - 1, 1);
    const y = height - pad - ((item.revenue || 0) / max) * (height - pad * 2);
    return { x, y, date: item.date, revenue: item.revenue };
  });
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(" ");
  const rectWidth = (width - pad * 2) / Math.max(data.length - 1, 1);

  if (!data.length) return <EmptyChart label="No revenue trend data" />;
  return (
    <div className="relative w-full overflow-visible font-sans">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-72 mx-auto overflow-visible">
        {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={width - pad} y1={pad + i * 58} y2={pad + i * 58} stroke="#EADBCE" strokeDasharray="4,2" opacity="0.6" />)}
        <polygon points={`${pad},${height - pad} ${pointsStr} ${width - pad},${height - pad}`} fill={GOLD} opacity="0.04" />
        <polyline points={pointsStr} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {hoveredIdx !== null && (
          <>
            <line
              x1={points[hoveredIdx].x}
              y1={pad}
              x2={points[hoveredIdx].x}
              y2={height - pad}
              stroke="#8B5A2B"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity="0.8"
            />
            <circle
              cx={points[hoveredIdx].x}
              cy={points[hoveredIdx].y}
              r="8"
              fill={GOLD}
              opacity="0.3"
            />
          </>
        )}

        {points.map((p, index) => (
          <circle 
            key={p.date} 
            cx={p.x} 
            cy={p.y} 
            r={hoveredIdx === index ? "6" : "4.5"} 
            fill={hoveredIdx === index ? "#8B5A2B" : GOLD} 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            style={{ transition: "all 0.15s ease" }}
          />
        ))}

        {points.map((p, index) => {
          const rectX = index === 0 ? p.x : p.x - rectWidth / 2;
          const currentWidth = (index === 0 || index === data.length - 1) ? rectWidth / 2 : rectWidth;
          return (
            <rect
              key={index}
              x={rectX}
              y={pad}
              width={currentWidth}
              height={height - pad * 2}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}

        <text x={pad} y={height - 4} fill="#A89E95" fontSize="9" fontWeight="800" className="font-sans uppercase tracking-widest">{data[0]?.date}</text>
        <text x={width - pad - 80} y={height - 4} fill="#A89E95" fontSize="9" fontWeight="800" className="font-sans uppercase tracking-widest text-right">{data[data.length - 1]?.date}</text>
      </svg>

      {hoveredIdx !== null && (
        <div 
          className="absolute bg-zinc-900/95 text-[#FAF6F0] px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border border-[#C5A059]/40 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 z-25"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100}%`,
            transform: 'translate(-50%, -125%)',
          }}
        >
          <p className="text-[#C5A059] uppercase tracking-wider mb-0.5">{points[hoveredIdx].date}</p>
          <p className="text-white font-mono font-extrabold text-xs">{money(points[hoveredIdx].revenue)}</p>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const max = Math.max(...data.map(item => item.value || 0), 1);
  if (!data.length) return <EmptyChart label="No barber revenue data logged yet" />;
  return (
    <div className="space-y-4 font-sans text-left">
      {data.map((item, index) => {
        const isHovered = hoveredIdx === index;
        return (
          <div 
            key={item.name} 
            className="space-y-1.5 p-2 rounded-xl transition-all duration-200"
            style={{ 
              background: isHovered ? "rgba(234, 219, 206, 0.2)" : "transparent"
            }}
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 tracking-tight">{item.name}</span>
              <span className="text-sm font-black text-amber-700 font-serif">{money(item.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-stone-50 border border-stone-200/60 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300" 
                style={{ 
                  width: `${Math.max((item.value / max) * 100, 4)}%`, 
                  backgroundColor: isHovered ? "#8B5A2B" : GOLD 
                }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PieChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!total) return <EmptyChart label="No service revenue transaction volume captured" />;
  let offset = 0;
  const colors = ["#B45309", "#D97706", "#F59E0B", "#FBBF24", "#FEF3C7", "#A89E95"];
  return (
    <div className="flex flex-col items-center gap-6 font-sans">
      <svg viewBox="0 0 42 42" className="h-44 w-44 shadow-sm rounded-full overflow-visible">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FAF6F0" strokeWidth="6" />
        <g transform="rotate(-90 21 21)">
          {data.map((item, index) => {
            const percent = (item.value / total) * 100;
            const isHovered = hoveredIdx === index;
            const segment = (
              <circle 
                key={item.name} 
                cx="21" 
                cy="21" 
                r="15.915" 
                fill="transparent" 
                stroke={colors[index % colors.length]} 
                strokeWidth={isHovered ? "7.5" : "6"} 
                strokeDasharray={`${percent} ${100 - percent}`} 
                strokeDashoffset={-offset}
                style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
            offset += percent;
            return segment;
          })}
        </g>

        {hoveredIdx !== null ? (
          <>
            <text x="21" y="18.5" textAnchor="middle" fontSize="3" fontWeight="800" fill="#3E362E" className="font-sans">
              {data[hoveredIdx].name.length > 13 ? data[hoveredIdx].name.slice(0, 10) + "..." : data[hoveredIdx].name}
            </text>
            <text x="21" y="22.5" textAnchor="middle" fontSize="3" fontWeight="950" fill="#8B5A2B" className="font-mono">
              {money(data[hoveredIdx].value)}
            </text>
            <text x="21" y="26" textAnchor="middle" fontSize="2" fontWeight="800" fill="#A89E95" className="font-sans uppercase tracking-wider">
              {((data[hoveredIdx].value / total) * 100).toFixed(1)}%
            </text>
          </>
        ) : (
          <>
            <text x="21" y="20" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#3E362E" className="font-serif">
              Total
            </text>
            <text x="21" y="24" textAnchor="middle" fontSize="3" fontWeight="950" fill="#8B5A2B" className="font-mono">
              {money(total)}
            </text>
          </>
        )}
      </svg>
      <RevenueList rows={data.slice(0, 3).map(item => ({ name: item.name, value: item.value }))} compact />
    </div>
  );
}

function RevenueList({ rows, compact = false }) {
  if (!rows.length) return <EmptyChart label="No metrics table data compiled" />;
  return (
    <div className="space-y-2 w-full font-sans text-left">
      {rows.map(row => (
        <div key={row.name} className="flex items-center justify-between rounded-xl bg-stone-50/50 border border-stone-200/60 px-4 py-3 hover:border-amber-600/40 transition-all duration-200">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-stone-900 tracking-tight">{row.name}</p>
            {!compact && <p className="text-[10px] text-stone-400 font-bold uppercase mt-0.5 tracking-wider font-sans">{row.count || 0} completions</p>}
          </div>
          <p className="ml-2 font-black text-amber-700 font-mono text-xs shrink-0">{money(row.value)}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans italic">
      {label}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white border border-stone-100" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100 lg:col-span-2" /><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100" /></div>
    </div>
  );
}

// ─── FINANCE SUB-COMPONENTS ───
function StatCard({ label, value }) {
  return (
    <div className="card p-6 flex flex-col justify-between bg-white">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 font-sans">{label}</h3>
      <p className="text-3xl font-black mt-1 font-serif text-stone-900 tracking-normal">{value}</p>
    </div>
  );
}
