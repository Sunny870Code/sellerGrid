const Review = require("../models/Review");

// GET all reviews with filters
exports.getReviews = async (req, res) => {
  try {
    const { platform, sentiment, rating, isResolved, search } = req.query;
    const filter = {};

    if (platform) filter.platform = platform;
    if (sentiment) filter.sentiment = sentiment;
    if (rating) filter.rating = Number(rating);
    if (isResolved !== undefined) filter.isResolved = isResolved === "true";
    if (search) filter.$or = [
      { productName: { $regex: search, $options: "i" } },
      { reviewText: { $regex: search, $options: "i" } },
      { reviewer: { $regex: search, $options: "i" } },
    ];

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET stats for dashboard
exports.getStats = async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const positive = await Review.countDocuments({ sentiment: "Positive" });
    const negative = await Review.countDocuments({ sentiment: "Negative" });
    const neutral = await Review.countDocuments({ sentiment: "Neutral" });
    const resolved = await Review.countDocuments({ isResolved: true });

    const platformCounts = await Review.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
    ]);

    const avgRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    res.json({
      success: true,
      data: {
        total, positive, negative, neutral, resolved,
        avgRating: avgRating[0]?.avg?.toFixed(1) || 0,
        platformCounts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST create review (with optional file)
exports.createReview = async (req, res) => {
  try {
    const reviewData = { ...req.body };
    if (req.file) reviewData.attachment = req.file.path;

    const review = await Review.create(reviewData);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PATCH toggle resolved
exports.toggleResolved = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: "Not found" });

    review.isResolved = !review.isResolved;
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE review
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
