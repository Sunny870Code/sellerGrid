import { CheckCircle, Trash2, Star } from "lucide-react";

const sentimentStyle = {
  Positive: "bg-green-500/15 text-green-400 border-green-500/30",
  Negative: "bg-red-500/15 text-red-400 border-red-500/30",
  Neutral:  "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const platformStyle = {
  Amazon:  "bg-orange-500/15 text-orange-400",
  Flipkart:"bg-blue-500/15 text-blue-400",
  Meesho:  "bg-pink-500/15 text-pink-400",
  Myntra:  "bg-purple-500/15 text-purple-400",
  Nykaa:   "bg-rose-500/15 text-rose-400",
  Other:   "bg-slate-500/15 text-slate-400",
};

export default function ReviewCard({ review, onToggle, onDelete }) {
  return (
    <div className={`glass rounded-2xl p-5 border fade-in-up transition-all duration-200 hover:border-sky-500/30 ${review.isResolved ? "opacity-60 border-green-500/20" : "border-slate-700/50"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${platformStyle[review.platform] || platformStyle.Other}`}>
              {review.platform}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sentimentStyle[review.sentiment]}`}>
              {review.sentiment}
            </span>
            {review.isResolved && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                ✓ Resolved
              </span>
            )}
          </div>

          <h3 className="font-display font-semibold text-white text-sm truncate">{review.productName}</h3>
          <p className="text-slate-400 text-xs mt-0.5 mb-3">by {review.reviewer}</p>

          {/* Stars */}
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={12} className={i <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
            ))}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{review.reviewText}</p>

          <p className="text-slate-600 text-xs mt-3">
            {new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onToggle(review._id)}
            title={review.isResolved ? "Mark unresolved" : "Mark resolved"}
            className={`p-2 rounded-xl transition-all ${review.isResolved ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-slate-400 hover:bg-green-500/20 hover:text-green-400"}`}
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="p-2 rounded-xl bg-slate-700/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
