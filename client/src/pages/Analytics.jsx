import { useEffect, useState } from "react";
import { SentimentPie, PlatformBar } from "../components/SentimentChart";
import { getStats } from "../services/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MOCK_STATS = {
  total: 1248, positive: 734, negative: 312, neutral: 202, resolved: 489, avgRating: "3.8",
  platformCounts: [
    { _id: "Amazon", count: 420 }, { _id: "Flipkart", count: 310 },
    { _id: "Meesho", count: 198 }, { _id: "Myntra", count: 175 }, { _id: "Nykaa", count: 145 },
  ],
};

const insights = [
  { icon: TrendingUp,   color: "green",  title: "Positive Trend",    body: "Amazon reviews improved by 18% this month. Focus on maintaining fast delivery and packaging quality." },
  { icon: TrendingDown, color: "red",    title: "Alert: Flipkart",   body: "Negative reviews up 23% on Flipkart. Most complaints are about shipping delays and damaged products." },
  { icon: Minus,        color: "amber",  title: "Neutral on Meesho", body: "Meesho reviews are mostly neutral. Opportunity to improve product descriptions and images." },
];

export default function Analytics() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    getStats().then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const resRate = Math.round((stats.resolved / stats.total) * 100) || 0;
  const posRate = Math.round((stats.positive / stats.total) * 100) || 0;
  const negRate = Math.round((stats.negative / stats.total) * 100) || 0;

  return (
    <div className="min-h-screen bg-grid-pattern bg-grid">
      <div className="mb-8">
        <h1 className="font-display font-bold text-white text-3xl">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Deep insights into your brand's review performance</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Positive Rate", value: `${posRate}%`, desc: "of all reviews", bar: posRate, color: "green" },
          { label: "Negative Rate", value: `${negRate}%`, desc: "need attention",  bar: negRate, color: "red"   },
          { label: "Resolution Rate", value: `${resRate}%`, desc: "issues resolved", bar: resRate, color: "sky" },
        ].map(item => (
          <div key={item.label} className="glass rounded-2xl p-5 border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`font-display font-bold text-4xl ${item.color === "green" ? "text-green-400" : item.color === "red" ? "text-red-400" : "text-sky-400"}`}>{item.value}</p>
            <p className="text-slate-500 text-xs mt-1 mb-4">{item.desc}</p>
            <div className="w-full bg-surface-600 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${item.color === "green" ? "bg-green-400" : item.color === "red" ? "bg-red-400" : "bg-sky-400"}`}
                style={{ width: `${item.bar}%`, transition: "width 1s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SentimentPie data={stats} />
        <PlatformBar data={stats.platformCounts} />
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="font-display font-semibold text-white text-lg mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map(({ icon: Icon, color, title, body }) => {
            const c = { green: "bg-green-500/10 border-green-500/20 text-green-400", red: "bg-red-500/10 border-red-500/20 text-red-400", amber: "bg-amber-500/10 border-amber-500/20 text-amber-400" }[color];
            return (
              <div key={title} className={`glass rounded-2xl p-5 border ${c.split(" ")[1]} fade-in-up`}>
                <div className={`inline-flex p-2.5 rounded-xl ${c.split(" ")[0]} mb-3`}>
                  <Icon size={18} className={c.split(" ")[2]} />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
