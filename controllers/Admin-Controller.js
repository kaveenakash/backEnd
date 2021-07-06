const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AddEditor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;
  let role = "editor";
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
    name: name,
    email: email,
    role: role,
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

  res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};

const GetAllEditors = async (req, res, next) => {
  try {
    const data = await User.find({ role: "editor" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json(error);
  }
};

const DeleteEditor = async (req,res,next) =>{
    const {id} = req.body
 
    try {
      const response = await User.findOneAndRemove({_id:id})
    } catch (err) {
      const error = new HttpError("Unexpected Error Occured", 503);
      return next(error);
    }

    return res.status(200).json({"message":"Removed Editor Successfully"})
}

module.exports = {
  AddEditor,
  GetAllEditors,
  DeleteEditor
};
