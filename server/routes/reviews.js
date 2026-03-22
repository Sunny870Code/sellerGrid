const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getReviews,
  getStats,
  createReview,
  toggleResolved,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);
router.get("/stats", getStats);
router.post("/", upload.single("attachment"), createReview);
router.patch("/:id/toggle", toggleResolved);
router.delete("/:id", deleteReview);

module.exports = router;
