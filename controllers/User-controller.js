const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//SignUp function
const UserSignUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    const { fname,lname, email, password } = req.body;
    const name = fname + " " + lname;
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Signing up failed, please try again later.",
        500
      );
      return next(error);
    }
    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422
      );
      return next(error);
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError("could not create user, Please try again", 500);
      return next(error);
    }
  
    const createdUser = new User({
      name:name,
      email:email,
      password: hashedPassword,
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signing Up failed,Please try again", 500);
      return next(error);
    }
    
    let token;
    try {
      token = await jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "supersecret_dont_share",
        { expiresIn: "1h" }
        );
      } catch (err) {
        const error = new HttpError("Signing Up failed,Please try again", 500);
        return next(error);
      }
     
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token,role:createdUser.role });
  };
  

  module.exports = {
    UserSignUp
  }