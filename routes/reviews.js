const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../module/listings.js");
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../module/reviews.js");
const { validatereviews } = require("../middleware");

// reviews route
router.post(
  "/",
  validatereviews,
  wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new reviews created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete route
router.delete(
  "/:reviewId",
  wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Delete reviews");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
