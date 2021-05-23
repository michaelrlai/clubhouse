const express = require("express");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Clubhouse App" });
});

router.get("/sign-up", function (req, res) {
  res.render("sign-up", { title: "Sign Up" });
});

router.post("/sign-up", [
  body("firstname", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .customSanitizer((value, { req }) => {
      return value[0].toUpperCase() + value.slice(1).toLowerCase();
    }),
  body("lastname", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .customSanitizer((value, { req }) => {
      return value[0].toUpperCase() + value.slice(1).toLowerCase();
    }),
  body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("repassword", "Password confirmation must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  function (req, res, next) {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      membership: "inactive",
    });
    if (!errors.isEmpty()) {
      res.render("sign-up", {
        title: "Sign Up",
        user: user,
        repassword: req.body.repassword,
        errors: errors.array(),
      });
      return;
    }
    user.save(function () {
      res.redirect("/");
    });
  },
]);

module.exports = router;
