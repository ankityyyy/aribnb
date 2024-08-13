const Listing = require("../module/listings.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

//show route
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing your request for does not exits");
    res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

//create route
module.exports.createListings = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let saveListing = await newListing.save();
  console.log(saveListing);

  req.flash("success", "New listing created successfully");
  res.redirect("/listings");
};

//edit rout
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing your request for does not exits");
    res.redirect("/listings");
  }
  res.render("edit.ejs", { listing });
};

//update
module.exports.updatelistings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(listing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    console.log(listing, "list");
    await listing.save();
  }
  await listing.save();
  req.flash("success", "listing update");
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Delete listings");
  res.redirect("/listings");
};
