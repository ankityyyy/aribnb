const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./module/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
// const Review = require("./module/reviews.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//Home Route
app.get("/", (req, res) => {
  res.send("hi i am root");
});
//Index Route
app.get(
  "/listings",
  wrapasync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  })
);

//New Route
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

//Create Rout
app.post(
  "/listings",
  wrapasync(async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // if (result.error) {
    //   throw new ExpressError(402, "i am error");
    // }
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//show route
app.get(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    res.render("show.ejs", { listing });
  })
);
//Edit Route
app.get(
  "/listings/:id/edit",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(listing);
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrongs" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log("listen on port number 3000");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
