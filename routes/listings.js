const express = require("express");
const router = express.Router();
const Listing = require("../module/listings.js");
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

//Index Route
router.get(
  "/",
  wrapasync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

//Create Rout
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapasync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
  })
);

//show route
router.get(
  "/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing your request for does not exits");
      res.redirect("/listings");
    }
    res.render("show.ejs", { listing });
  })
);
//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,

  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing your request for does not exits");
      res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(listing);
    req.flash("success", "listing update");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Delete listings");
    res.redirect("/listings");
  })
);

module.exports = router;
