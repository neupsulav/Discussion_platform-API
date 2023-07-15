const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const CommentItem = require("../models/commentItem");
const { default: mongoose } = require("mongoose");

//create a post
const createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    name: req.user.name,
    username: req.user.username,
    image: req.user.image,
    heading: req.body.heading,
    description: req.user.description,
    createdBy: req.user.userId,
  });
  post.save();

  if (!post) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(201).json({ msg: "Post created" });
});

//add comment
const createComment = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 400));
  }
  const id = req.params.id;

  const commentItem = await CommentItem.create({
    image: req.user.image,
    name: req.user.name,
    commentText: req.body.commentText,
  });

  const comment = await Post.findByIdAndUpdate(
    { _id: id },
    { $push: { comment: commentItem._id } },
    { new: true }
  );

  res.status(201).json({ success: true });
});

//get all posts
const getPost = catchAsync(async (req, res, next) => {
  const posts = await Post.find({}).populate("comment").sort({ createdAt: -1 });

  if (!posts) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).send(posts);
});

//get a post
const getSinglePost = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 400));
  }

  const id = req.params.id;

  const post = await Post.findOne({ _id: id }).populate("comment");

  if (!post) {
    return next(new ErrorHandler(`No post with ID ${id} found`, 404));
  }

  res.status(200).send(post);
});

module.exports = {
  createPost,
  createComment,
  getPost,
  getSinglePost,
};
