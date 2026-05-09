// import React from "react";
// import { useAuth } from "../AppContext";

// export default function Navbar({ activePage, setActivePage }) {
//   const { currentUser, logout, canViewFinance } = useAuth();

//   const navItems = [
//     { key: "dashboard", label: "Dashboard" },
//     { key: "queue", label: "Queue" },
//     ...(canViewFinance() ? [{ key: "finance", label: "Finance" }] : []),
//     ...(currentUser?.role === "owner" ? [{ key: "settings", label: "Settings" }] : []),
//   ];

//   return (
//     <nav className="bg-orange-900 text-white shadow-lg">
//       <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
//         <div className="flex items-center gap-2">
//           <span className="font-bold text-lg tracking-tight">The Royal Blade</span>
//           <span className="ml-2 text-xs bg-orange-700 px-2 py-0.5 rounded-full text-orange-100">
//             {currentUser?.role === "owner" ? "Owner" : "Barber"}
//           </span>
//         </div>
//         <div className="flex items-center gap-1">
//           {navItems.map(item => (
//             <button
//               key={item.key}
//               onClick={() => setActivePage(item.key)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
//                 activePage === item.key
//                   ? "bg-orange-600 text-white"
//                   : "text-orange-200 hover:bg-orange-800"
//               }`}
//             >
//               {item.label}
//             </button>
//           ))}
//           <button
//             onClick={logout}
//             className="ml-3 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AppContext";

export default function Navbar() {
  const { currentUser, logout, canViewFinance } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/owner/overview" },
    { key: "queue",     label: "Queue",      path: "/barber/queue"   },
    ...(canViewFinance()
      ? [{ key: "finance",  label: "Finance",  path: "/owner/finance"  }]
      : []),
    ...(currentUser?.role === "owner"
      ? [{ key: "settings", label: "Settings", path: "/owner/settings" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/staff-login");
  };

  return (
    <nav className="bg-orange-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">The Royal Blade</span>
          <span className="ml-2 text-xs bg-orange-700 px-2 py-0.5 rounded-full text-orange-100">
            {currentUser?.role === "owner" ? "Owner" : "Barber"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                location.pathname === item.path
                  ? "bg-orange-600 text-white"
                  : "text-orange-200 hover:bg-orange-800"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="ml-3 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}