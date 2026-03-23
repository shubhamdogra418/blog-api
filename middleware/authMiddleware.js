//only logged in users can access the apis and we see cookies for that

//set cookies when logging in and check when accessing any api

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");
  next();
});

//check if an admin
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
});

module.exports = { protect, adminOnly };
