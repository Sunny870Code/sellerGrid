import { NavLink } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Star } from "lucide-react";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/reviews", icon: MessageSquare, label: "Reviews" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-sky-500/10 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center glow">
            <Star size={18} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-none">SellerGrid</h1>
            <p className="text-sky-400 text-xs mt-0.5">Review Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sky-500/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            SG
          </div>
          <div>
            <p className="text-white text-xs font-medium">SellerGrid</p>
            <p className="text-slate-500 text-xs">Brand Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
