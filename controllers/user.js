const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const { default: mongoose } = require("mongoose");

//get all users
const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "following", select: "_id name username image" })
    .populate({ path: "followers", select: "_id name username image" })
    .select("-password");

  if (!users) {
    return next(new ErrorHandler("Something went wrong"), 400);
  }

  res.status(200).send(users);
});

module.exports = { getUsers };
