const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const CommentItem = require("../models/commentItem");
const { default: mongoose } = require("mongoose");

//create a post
const createPost = catchAsync(async (req, res, next) => {
  // multer
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const post = await Post.create({
    name: req.user.name,
    username: req.user.username,
    image: req.user.image,
    heading: req.body.heading,
    description: req.user.description,
    createdBy: req.user.userId,
    postImages: imagesPaths,
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

//like and unlike post
const likePost = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 400));
  }
  const id = req.params.id;

  //preventing a user from liking post multiple times
  const isAlreadyLiked = await Post.findOne({
    _id: id,
    likes: req.user.userId,
  });

  if (!isAlreadyLiked) {
    const likes = await Post.findByIdAndUpdate(
      { _id: id },
      { $push: { likes: req.user.userId } },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, likesCount: likes.likes.length });
  } else {
    const likes = await Post.findByIdAndUpdate(
      { _id: id },
      { $pull: { likes: req.user.userId } },
      {
        new: true,
      }
    );
    res
      .status(400)
      .json({ msg: "Post already liked", likesCount: likes.likes.length });
  }
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

//update post
const updatePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const updatePost = await Post.findByIdAndUpdate(
    {
      _id: id,
    },
    req.body,
    { new: true }
  );

  if (!updatePost) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).json({ msg: "Post Updated successfully" });
});

//delete post
const deletePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const deletePost = await Post.findByIdAndRemove({
    _id: id,
  });

  if (!deletePost) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).json({ success: true, msg: "Post deleted" });
});

module.exports = {
  createPost,
  createComment,
  getPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
};
