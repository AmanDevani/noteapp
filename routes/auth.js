require('dotenv').config()
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../Middlewares/fetchuser');



//Route 1: create user using post req: /api/auth/createuser ... No Login required
router.post(
  "/register",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be in 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //there are errors then return bad requests and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this email already exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        // return res.status(400).json({ errors: errors.array() });
        return res.status(400).json({ msg:"The user already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, process.env.TOKEN_SECRET);
      // res.json(user)
      // res.json({ authtoken });
      res.json({msg:"Sign up Success"})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some eroor occured");
    }
  }
);

//Route 2 :authenticate user using post req: /api/auth/login ... No Login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    //there are errors then return bad requests and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "Email not found" });
      }

      const passwordcomapare = await bcrypt.compare(password, user.password);
      if (!passwordcomapare) {
        return res
          .status(400)
          .json({ msg: "please try to login with correct Email and Password" });
          
      } 

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, process.env.TOKEN_SECRET,{expiresIn:"1d"});

      res.json({ authtoken });
      // res.json({msg:"login Success"})

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal sever error")
    }
  }

);


//Route 3 :get logged in user details using : /api/auth/getuser ... Login required
router.post(
  "/getuser", fetchuser,
  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.find({ userId }).select("-password");
      res.send(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal sever error")
    }
  }
);


module.exports = router;
