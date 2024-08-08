const express = require("express");
const router = express.Router();
const User = require("../module/users.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

//singup
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//singup
router.post(
  "/signup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, phone, password } = req.body;
      const newUser = new User({ username, email, phone });
      const userRegister = await User.register(newUser, password);
      req.login(userRegister, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//login
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

//logout
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "you are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
