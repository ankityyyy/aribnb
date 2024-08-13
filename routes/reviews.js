const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { validatereviews } = require("../middleware");
const reviewController = require("../controllers/review.js");

// reviews route
router.post("/", validatereviews, wrapasync(reviewController.reviewCreated));

//delete route
router.delete("/:reviewId", wrapasync(reviewController.reviewDelete));

module.exports = router;
