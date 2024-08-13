const express = require("express");
const router = express.Router();
const Listing = require("../module/listings.js");
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route //Create Rout
router
  .route("/")
  .get(wrapasync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingControllers.createListings)
  );
// .post(upload.single("listing[image]"), (req, res) => {
//   console.log(req.file);
//   res.send(req.file);
// });

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//show route
//Update Route
//Delete Route
router
  .route("/:id")
  .get(wrapasync(listingControllers.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(listingControllers.updatelistings)
  )
  .delete(isLoggedIn, isOwner, wrapasync(listingControllers.deleteListings));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,

  wrapasync(listingControllers.renderEditForm)
);

module.exports = router;
