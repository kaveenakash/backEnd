const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

//SignUp function
const PresentationSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { fname, lname, title, email, password, content } = req.body;
  const role = "researcher";
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

  const name = fname + " " + lname;
  const createdUser = new User({
    name: name,
    title: title,
    email: email,
    content: content,
    status: "pending",
    role: role,
    document: req.file.path,
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

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    role: role,
  });
};

const GetAllPresentations = async (req, res, next) => {
  try {
    const response = await User.find({ role: "researcher", status: "pending" });
    return res.status(200).send(response);
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 500);
    return next(error);
  }
};

const ApprovePresentation = async (req, res, next) => {
  const { id } = req.body;

  const filter = { _id: id };
  const update = { status: "approved" };

  try {
    let response = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "icafsliit2021@gmail.com",
      pass: "#icaf225",
    },
  });

  var mailOptions = {
    from: "icafsliit2021@gmail.com",
    to: "kaveenakash1998@gmail.com",
    subject: "Research Presentation",
    text: "Your Research Paper Approved",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(200).json({ message: "successful" });
};

const DeleteResearchPresentation = async (req, res, next) => {
  const { id } = req.body;

  try {
    const response = await User.findOneAndRemove({ _id: id });
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "icafsliit2021@gmail.com",
      pass: "#icaf225",
    },
  });

  var mailOptions = {
    from: "icafsliit2021@gmail.com",
    to: "kaveenakash1998@gmail.com",
    subject: "Research Paper Presentation",
    text: "Your Research Paper Declined",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res
    .status(200)
    .json({ message: "deleted Research Paper Successfully" });
};

const GetAllApprovedResearchPapers = async (req, res, next) => {
  try {
    const data = await User.find({ status: "approved", role: "researcher" });

    return res.status(200).send(data);
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }
};

const getPresentationDetails = async (req, res, next) => {
  try {
    const data = await User.find({ role: "researcher" });
    const totalDocuments = await data.length;

    pendingData = await User.find({ role: "researcher", status: "pending" });
    const pendingDocuments = await pendingData.length;
    console.log(totalDocuments);

    approveData = await User.find({ role: "researcher", status: "approved" });
    const approveDocuments = await approveData.length;

    return res
      .status(200)
      .json({ totalDocuments, pendingDocuments, approveDocuments });
  } catch (err) {
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }
};

module.exports = {
  GetAllPresentations,
  PresentationSignUp,
  ApprovePresentation,
  DeleteResearchPresentation,
  GetAllApprovedResearchPapers,
  getPresentationDetails,
};
