import { useEffect, useState } from "react";
import { Search, Plus, X, Upload } from "lucide-react";
import ReviewCard from "../components/ReviewCard";
import { getReviews, createReview, toggleResolved, deleteReview } from "../services/api";

const PLATFORMS  = ["All", "Amazon", "Flipkart", "Meesho", "Myntra", "Nykaa", "Other"];
const SENTIMENTS = ["All", "Positive", "Negative", "Neutral"];

const MOCK_REVIEWS = [
  { _id: "1", platform: "Amazon",   productName: "Wireless Earbuds Pro X",  reviewer: "Rahul M.",   rating: 5, reviewText: "Absolutely love these earbuds! Sound quality is crystal clear and battery life is outstanding.", sentiment: "Positive", isResolved: false, date: new Date() },
  { _id: "2", platform: "Flipkart", productName: "Smart Watch Series 4",    reviewer: "Priya S.",   rating: 2, reviewText: "Very disappointed. The product stopped working after 3 days. Customer service was unhelpful.", sentiment: "Negative", isResolved: false, date: new Date() },
  { _id: "3", platform: "Meesho",   productName: "Cotton Kurta Set",        reviewer: "Anjali K.",  rating: 4, reviewText: "Good quality fabric. Fitting is slightly different from size chart but overall happy.", sentiment: "Neutral",  isResolved: true,  date: new Date() },
  { _id: "4", platform: "Myntra",   productName: "Running Shoes Air Boost", reviewer: "Vikram D.",  rating: 5, reviewText: "Best running shoes I've ever bought! Super comfortable and lightweight.", sentiment: "Positive", isResolved: false, date: new Date() },
  { _id: "5", platform: "Nykaa",    productName: "Vitamin C Serum 30ml",    reviewer: "Sneha R.",   rating: 1, reviewText: "Caused skin irritation. Not suitable for sensitive skin. Very bad experience.", sentiment: "Negative", isResolved: false, date: new Date() },
  { _id: "6", platform: "Amazon",   productName: "Bluetooth Speaker Mini",  reviewer: "Arjun P.",   rating: 3, reviewText: "Decent sound for the price. Bass could be better but overall an okay product.", sentiment: "Neutral",  isResolved: true,  date: new Date() },
];

const emptyForm = { platform: "Amazon", productName: "", reviewer: "", rating: 5, reviewText: "", sentiment: "Positive", category: "Other" };

export default function Reviews() {
  const [reviews, setReviews]     = useState(MOCK_REVIEWS);
  const [search, setSearch]       = useState("");
  const [platform, setPlatform]   = useState("All");
  const [sentiment, setSentiment] = useState("All");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [file, setFile]           = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const params = {};
      if (platform  !== "All") params.platform  = platform;
      if (sentiment !== "All") params.sentiment = sentiment;
      if (search)               params.search    = search;
      const res = await getReviews(params);
      setReviews(res.data.data);
    } catch {
      setUsingMock(true);
      // client-side filter on mock
      setReviews(MOCK_REVIEWS.filter(r =>
        (platform  === "All" || r.platform  === platform) &&
        (sentiment === "All" || r.sentiment === sentiment) &&
        (!search || r.productName.toLowerCase().includes(search.toLowerCase()) ||
                    r.reviewText.toLowerCase().includes(search.toLowerCase()))
      ));
    }
  };

  useEffect(() => { fetchReviews(); }, [platform, sentiment]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (usingMock) {
        setReviews(prev => [{ ...form, _id: Date.now().toString(), date: new Date(), isResolved: false }, ...prev]);
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (file) fd.append("attachment", file);
        await createReview(fd);
        await fetchReviews();
      }
      setForm(emptyForm);
      setFile(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    if (usingMock) { setReviews(prev => prev.map(r => r._id === id ? { ...r, isResolved: !r.isResolved } : r)); return; }
    await toggleResolved(id); fetchReviews();
  };

  const handleDelete = async (id) => {
    if (usingMock) { setReviews(prev => prev.filter(r => r._id !== id)); return; }
    await deleteReview(id); fetchReviews();
  };

  return (
    <div className="min-h-screen bg-grid-pattern bg-grid">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-3xl">Reviews</h1>
          <p className="text-slate-400 text-sm mt-1">{reviews.length} reviews found</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors glow"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 border border-slate-700/50 mb-6 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-48 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews…"
              className="w-full bg-surface-700 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>
          <button type="submit" className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-4 py-2 rounded-xl text-sm hover:bg-sky-500/30 transition-colors">
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${platform === p ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-surface-700 text-slate-400 border border-slate-700/50 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {SENTIMENTS.map(s => (
            <button key={s} onClick={() => setSentiment(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sentiment === s ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-surface-700 text-slate-400 border border-slate-700/50 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {reviews.map(r => (
          <ReviewCard key={r._id} review={r} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
        {reviews.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-500">No reviews found.</div>
        )}
      </div>

      {/* Add Review Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-sky-500/20 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-white text-lg">Add Review</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Platform</label>
                  <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                    className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50">
                    {PLATFORMS.filter(p => p !== "All").map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Sentiment</label>
                  <select value={form.sentiment} onChange={e => setForm(p => ({ ...p, sentiment: e.target.value }))}
                    className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50">
                    {["Positive", "Negative", "Neutral"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Product Name</label>
                <input required value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))}
                  className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
                  placeholder="e.g. Wireless Earbuds Pro" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Reviewer Name</label>
                  <input required value={form.reviewer} onChange={e => setForm(p => ({ ...p, reviewer: e.target.value }))}
                    className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
                    placeholder="e.g. Rahul M." />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Rating (1–5)</label>
                  <input type="number" min={1} max={5} required value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Review Text</label>
                <textarea required rows={3} value={form.reviewText} onChange={e => setForm(p => ({ ...p, reviewText: e.target.value }))}
                  className="w-full bg-surface-700 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
                  placeholder="Customer's review text…" />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Attachment (optional)</label>
                <label className="flex items-center gap-2 border border-dashed border-slate-600 rounded-xl px-4 py-3 cursor-pointer hover:border-sky-500/50 transition-colors">
                  <Upload size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{file ? file.name : "Upload image or PDF"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-surface-700 text-slate-300 border border-slate-700/50 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {submitting ? "Saving…" : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
