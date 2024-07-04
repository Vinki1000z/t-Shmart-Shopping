const express = require("express");
const router = express.Router();

//  importing the users_schema
const auth = require("../../models/users_schema");

const userVerification=require("../../middleware/userVerification.js")

//  api/auth/userVerification
router.get("/userVerification",userVerification,async(req,res)=>{
    try {
      let userid = req.user.id;
      const client = await auth.findById(userid).select("-password");
      res.send(client);
    }  catch (error) {
      res.json({msg:"Error comes in the Getting Id From The Token",error});
  }
  })

module.exports=router