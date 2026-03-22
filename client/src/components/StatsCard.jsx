export default function StatsCard({ label, value, icon: Icon, color, sub }) {
  const colorMap = {
    sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-400",    icon: "text-sky-400" },
    green:  { bg: "bg-green-500/10",  border: "border-green-500/20",  text: "text-green-400",  icon: "text-green-400" },
    red:    { bg: "bg-red-500/10",    border: "border-red-500/20",    text: "text-red-400",    icon: "text-red-400" },
    amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-400",  icon: "text-amber-400" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", icon: "text-purple-400" },
  };
  const c = colorMap[color] || colorMap.sky;

  return (
    <div className={`glass rounded-2xl p-5 border ${c.border} fade-in-up hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{label}</p>
          <p className={`font-display font-bold text-3xl mt-1 ${c.text}`}>{value}</p>
          {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`${c.bg} rounded-xl p-2.5`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
    </div>
  );
}
