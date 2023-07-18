const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");

//get profile data
const profileData = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ createdBy: req.user.userId })
    .populate("comment")
    .sort({ createdAt: -1 });

  const userData = await User.findOne({ _id: req.user.userId })
    .populate({ path: "following", select: "_id name username image" })
    .populate({ path: "followers", select: "_id name username image" })
    .select("-password");

  let data = {
    name: req.user.name,
    username: req.user.username,
    image: req.user.image,
    posts: posts,
  };

  res.status(200).json({ userData, posts });
});

module.exports = { profileData };
