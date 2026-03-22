const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["Amazon", "Flipkart", "Meesho", "Myntra", "Nykaa", "Other"],
      required: true,
    },
    productName: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },
    category: {
      type: String,
      enum: ["Shipping", "Quality", "Price", "Service", "Packaging", "Other"],
      default: "Other",
    },
    isResolved: { type: Boolean, default: false },
    attachment: { type: String, default: null }, // multer uploaded file path
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
