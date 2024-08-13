const express = require("express");
const router = express.Router();
const User = require("../module/users.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");

//singup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapasync(userController.signup));

//login
router
  .route("/login")
  .get(userController.RenderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//logout
router.get("/logout", userController.logout);

module.exports = router;
