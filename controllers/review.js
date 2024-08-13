const Listing = require("../module/listings.js");
const Review = require("../module/reviews.js");

module.exports.reviewCreated = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "new reviews created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.reviewDelete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "Delete reviews");
  res.redirect(`/listings/${id}`);
};
