const express = require("express");
const router = express.Router();

//  importing the users_schema
const auth = require("../../models/users_schema");

// ecpress-validation
const { body, validationResult } = require("express-validator");
const { error } = require("ajv/dist/vocabularies/applicator/dependencies.js");

//  bycrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Jwt Token Work
var jwt = require("jsonwebtoken");
const jwt_word = "thisisjwttoken";

let success = false;

// 1. Creating the User (/api/auth/signup)
router.post(
  "/signUp",
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
      if (user) {
        return res.json({ msg: "User Exist, Try New Email Id", success });
      }
      let hash_pass = await bcrypt.hash(req.body.password, saltRounds);
      const NewUser = new auth({
        name: req.body.name,
        password: hash_pass,
        email: req.body.email,
        isGoogleUser: false,
      });

      // saving in the db
      await NewUser.save();

      //   Jwt Token Session
      let data = {
        user: {
          id: NewUser._id,
        },
      };

      const token = jwt.sign(data, jwt_word);
      res.json({ msg: token, success });
    } catch (error) {
      return res.status(400).json({ msg: error.message, success });
    }
  }
);

module.exports = router;
