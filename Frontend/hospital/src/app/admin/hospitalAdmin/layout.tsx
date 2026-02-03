// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import {
//   LayoutDashboard,
//   UserPlus, // For Doctors
//   Users, // For Patients
//   CalendarDays, // Appointments
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Hospital,
//   ChevronDown,
// } from "lucide-react";
// import { useAuth } from "../../../../context/AuthContext";

// export default function HospitalAdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, fetchUser } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");

//   // Fetch user if not loaded
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("/api/logout", {}, { withCredentials: true });
//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const sidebarItems = [
//     {
//       id: "overview",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       route: "/admin/hospitalAdmin",
//     },
//     {
//       id: "doctors",
//       label: "Manage Doctors",
//       icon: UserPlus,
//       route: "/admin/hospitalAdmin/doctors",
//     },
//     {
//       id: "patients",
//       label: "Patients",
//       icon: Users,
//       route: "/admin/hospitalAdmin/patients",
//     },
//     {
//       id: "appointments",
//       label: "Appointments",
//       icon: CalendarDays,
//       route: "/admin/hospitalAdmin/appointments",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: Settings,
//       route: "/admin/hospitalAdmin/settings",
//     },
//   ];

//   return (
//     <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
//       {/* Mobile Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ---------------- SIDEBAR ---------------- */}
//       <aside
//         className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-6 border-b border-gray-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {/* CHANGED TO BLUE GRADIENT */}
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
//               <span className="text-white font-bold text-xl">H</span>
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-800 leading-tight">
//                 Swasth-Raho
//               </h1>
//               <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
//                 Hospital Panel
//               </p>
//             </div>
//           </div>
//           <button
//             className="md:hidden text-gray-500"
//             onClick={() => setIsSidebarOpen(false)}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="mt-6 px-4 space-y-2">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.route}
//               onClick={() => {
//                 setActiveTab(item.id);
//                 setIsSidebarOpen(false);
//               }}
//               className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
//                 activeTab === item.id
//                   ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" // CHANGED TO BLUE
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`}
//             >
//               <item.icon
//                 className={`w-5 h-5 transition-colors ${
//                   activeTab === item.id ? "text-blue-600" : "text-gray-400" // CHANGED TO BLUE
//                 }`}
//               />
//               <span className="ml-3">{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm gap-2"
//           >
//             <LogOut size={18} /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* TOP HEADER */}
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 sm:px-6 py-3">
//             {/* Left: Menu Toggle & Title */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
//                 Hospital Administration
//               </h2>
//             </div>

//             {/* Right: Profile */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
//               >
//                 <div className="text-right hidden sm:block">
//                   <p className="text-sm font-semibold text-gray-800">
//                     {user?.name || "Dr. Admin"}
//                   </p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//                 {/* CHANGED AVATAR BORDER TO BLUE */}
//                 <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border border-blue-200">
//                   <img
//                     src={user?.profileImg || "https://via.placeholder.com/150"}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <ChevronDown size={16} className="text-gray-400" />
//               </button>

//               {/* Dropdown */}
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
//                   <div className="px-4 py-3 border-b border-gray-50">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {user?.name}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">
//                       {user?.email}
//                     </p>
//                   </div>
//                   <div className="p-1">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
//                     >
//                       Sign out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
// Import usePathname hook
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function HospitalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get current path
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      route: "/admin/hospitalAdmin",
    },
    {
      id: "doctors",
      label: "Manage Doctors",
      icon: UserPlus,
      route: "/admin/hospitalAdmin/doctors",
    },
    {
      id: "patients",
      label: "Patients",
      icon: Users,
      route: "/admin/hospitalAdmin/patients",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: CalendarDays,
      route: "/admin/hospitalAdmin/appointments",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/admin/hospitalAdmin/settings",
    },
  ];

  // Helper to check if a tab is active
  const isActive = (route: string) => {
    // Exact match for dashboard home, includes for subpages
    if (route === "/admin/hospitalAdmin" && pathname !== "/admin/hospitalAdmin")
      return false;
    return pathname?.startsWith(route);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Swasth-Raho
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Hospital Panel
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const active = isActive(item.route);

            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm gap-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
                Hospital Administration
              </h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Dr. Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border border-blue-200">
                  <img
                    src={user?.profileImg || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
