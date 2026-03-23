//when registering and logging in user then sending the token as cookies
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const sendTokenCookie = (res, userId) => {
  //jwt as header, payload and signature
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists !!!");
  }
  const newUser = await User.create({ name, email, password });
  sendTokenCookie(res, newUser._id);
  res.status(201).json({ message: "User successfully created", newUser });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendTokenCookie(res, user._id);
  res.status(200).json({
    message: "Logged in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ message: "Fetched the user info successfully", user: req.user });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    message: "Fetched all users successfully",
    count: users.length,
    users,
  });
});

module.exports = { register, login, logout, getMe, getUsers };
