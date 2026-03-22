import { useEffect, useState } from "react";
import { MessageSquare, TrendingUp, TrendingDown, Star, CheckCircle } from "lucide-react";
import StatsCard from "../components/StatsCard";
import { SentimentPie, PlatformBar } from "../components/SentimentChart";
import { getStats, getReviews, toggleResolved, deleteReview } from "../services/api";
import ReviewCard from "../components/ReviewCard";

// Mock data fallback when backend is not connected
const MOCK_STATS = {
  total: 1248,
  positive: 734,
  negative: 312,
  neutral: 202,
  resolved: 489,
  avgRating: "3.8",
  platformCounts: [
    { _id: "Amazon", count: 420 },
    { _id: "Flipkart", count: 310 },
    { _id: "Meesho", count: 198 },
    { _id: "Myntra", count: 175 },
    { _id: "Nykaa", count: 145 },
  ],
};

const MOCK_REVIEWS = [
  { _id: "1", platform: "Amazon", productName: "Wireless Earbuds Pro X", reviewer: "Rahul M.", rating: 5, reviewText: "Absolutely love these earbuds! The sound quality is crystal clear and battery life is outstanding. Delivered in 2 days, perfectly packaged.", sentiment: "Positive", isResolved: false, date: new Date() },
  { _id: "2", platform: "Flipkart", productName: "Smart Watch Series 4", reviewer: "Priya S.", rating: 2, reviewText: "Very disappointed. The product stopped working after 3 days. Customer service was unhelpful and return process was a nightmare.", sentiment: "Negative", isResolved: false, date: new Date() },
  { _id: "3", platform: "Meesho", productName: "Cotton Kurta Set", reviewer: "Anjali K.", rating: 4, reviewText: "Good quality fabric. The fitting is slightly different from the size chart but overall happy with the purchase.", sentiment: "Neutral", isResolved: true, date: new Date() },
];

export default function Dashboard() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          getStats(),
          getReviews({ limit: 6 }),
        ]);
        setStats(statsRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch {
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (id) => {
    if (usingMock) {
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isResolved: !r.isResolved } : r));
      return;
    }
    await toggleResolved(id);
    const res = await getReviews({ limit: 6 });
    setReviews(res.data.data);
  };

  const handleDelete = async (id) => {
    if (usingMock) {
      setReviews(prev => prev.filter(r => r._id !== id));
      return;
    }
    await deleteReview(id);
    const res = await getReviews({ limit: 6 });
    setReviews(res.data.data);
  };

  return (
    <div className="min-h-screen bg-grid-pattern bg-grid">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-ring" />
          <p className="text-green-400 text-xs font-medium">Live Dashboard</p>
          {usingMock && <span className="text-amber-400 text-xs ml-2">(Demo mode — connect backend for live data)</span>}
        </div>
        <h1 className="font-display font-bold text-white text-3xl">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor and manage all your brand reviews across platforms</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Total Reviews" value={stats.total?.toLocaleString()} icon={MessageSquare} color="sky" sub="All platforms" />
        <StatsCard label="Positive" value={stats.positive?.toLocaleString()} icon={TrendingUp} color="green" sub={`${Math.round((stats.positive/stats.total)*100)}% of total`} />
        <StatsCard label="Negative" value={stats.negative?.toLocaleString()} icon={TrendingDown} color="red" sub="Needs attention" />
        <StatsCard label="Avg Rating" value={`${stats.avgRating}★`} icon={Star} color="amber" sub="Out of 5.0" />
        <StatsCard label="Resolved" value={stats.resolved?.toLocaleString()} icon={CheckCircle} color="purple" sub="Issues closed" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SentimentPie data={stats} />
        <PlatformBar data={stats.platformCounts} />
      </div>

      {/* Recent Reviews */}
      <div>
        <h2 className="font-display font-semibold text-white text-lg mb-4">Recent Reviews</h2>
        {loading ? (
          <div className="text-slate-500 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <ReviewCard key={r._id} review={r} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
