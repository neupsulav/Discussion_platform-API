const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");

//get profile data
const profileData = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ createdBy: req.user.userId })
    .populate("comment")
    .sort({ createdAt: -1 });

  let data = {
    name: req.user.name,
    username: req.user.username,
    image: req.user.image,
    posts: posts,
  };

  res.status(200).send(data);
});

module.exports = { profileData };
