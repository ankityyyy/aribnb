const mongoose = require("mongoose");
const Listing = require("../module/listings.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66af8fc7d287abe64942e4a1",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was saved");
};

initDb();
