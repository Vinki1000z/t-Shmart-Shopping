const express = require("express");
const router = express.Router();

//  importing the users_schema
const auth = require("../../models/users_schema");

// ecpress-validation
const { body, validationResult } = require("express-validator");

//  bycrypt
const bcrypt = require("bcrypt");

// Jwt Token Work
var jwt = require("jsonwebtoken");
const jwt_word = "thisisjwttoken";

//  importing the middleware
const userVerification = require("../../middleware/userVerification.js");

let success = false;

// 1. Creating the User (/api/auth/logIn)
router.post(
  "/logIn",
  [
    // Validate name
    body("name").notEmpty().withMessage("Name is required"),

    // Validate password
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    // Validate email
    body("email").isEmail().withMessage("Email is not valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let triversing = errors.array();
      let error = triversing.map((err) => err.msg);
      return res.status(400).json({ msg: error, success });
    }

    try {
      // checking for the unique email address
      let user = await auth.findOne({ email: req.body.email });
      if (!user) {
        return res.json({ msg: "Login With Correct Parameters", success });
      }

      // checking the password
      const password = req.body.password;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          msg: "PLease Login With Correct Parameters",
          success,
        });
      }
      //   Jwt Token Session
      let data = {
        user: {
          id: user._id,
        },
      };

      const token = jwt.sign(data, jwt_word);

      //    Marking The Succes True
      success = true;
      res.json({ msg: token, success });
    } catch (error) {
      return res.json({ msg:error.message, success });
    }
  }
);


module.exports = router;
