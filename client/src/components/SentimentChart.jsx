import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = { Positive: "#4ade80", Negative: "#f87171", Neutral: "#fbbf24" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-sky-500/20 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

export function SentimentPie({ data }) {
  const pieData = [
    { name: "Positive", value: data.positive || 0 },
    { name: "Negative", value: data.negative || 0 },
    { name: "Neutral",  value: data.neutral  || 0 },
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/50">
      <h3 className="font-display font-semibold text-white text-sm mb-4">Sentiment Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.1)", borderRadius: 12, fontSize: 12 }} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span className="text-slate-300 text-xs">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformBar({ data }) {
  const chartData = (data || []).map(d => ({ name: d._id, Reviews: d.count }));

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/50">
      <h3 className="font-display font-semibold text-white text-sm mb-4">Reviews by Platform</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Reviews" stroke="#38bdf8" strokeWidth={2} fill="url(#colorReviews)" dot={{ fill: "#38bdf8", strokeWidth: 0, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
