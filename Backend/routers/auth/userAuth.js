const express = require("express");
const router = express.Router();


//  importing the users_schema
const auth=require("../../models/users_schema");

// ecpress-validation
const { body, validationResult } = require('express-validator');
const { error } = require("ajv/dist/vocabularies/applicator/dependencies.js");

//  bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;


let success=false;

// 1. Creating the User (/api/auth/signup)
router.post("/signUp",
    [
        // Validate name
        body("name").notEmpty().withMessage("Name is required"),
    
        // Validate password
        body("password")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long"),
    
        // Validate email
        body("email").isEmail().withMessage("Email is not valid"),
      ]
    ,async(req,res)=>{

        const result = validationResult(req);
        if (result.isEmpty()) {
          return res.json({msg:error,success});
        }

        try {
//  i ll work from here


            
        } catch (error) {
            
        }

})

module.exports = router;