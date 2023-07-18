const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const { default: mongoose } = require("mongoose");

//follow a user
const followUser = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid user ID", 400));
  }
  const id = req.params.id;

  //prevent a user from following same user multiple times
  const isAlreadyFollowing = await User.findOne({
    _id: req.user.userId,
    following: id,
  });

  if (!isAlreadyFollowing) {
    const user = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      {
        $push: { following: id },
      },
      { new: true }
    );

    const isInFollowersList = await User.findOne({
      _id: id,
      followers: req.user.userId,
    });

    if (!isInFollowersList) {
      const updateFollowingList = await User.findByIdAndUpdate(
        { _id: id },
        {
          $push: { followers: req.user.userId },
        },
        { new: true }
      );
    }

    res.status(200).json({ msg: `Followed the user` });
  } else {
    const user = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      {
        $pull: { following: id },
      },
      { new: true }
    );

    const updateFollowingList = await User.findByIdAndUpdate(
      { _id: id },
      {
        $pull: { followers: req.user.userId },
      },
      { new: true }
    );
    res.status(400).json({ msg: "Unfollowed user" });
  }

  //update followers list

  //prevent followers list to contain same user multiple times

  //   const isInFollowersList = await User.findOne({
  //     _id: id,
  //     followers: req.user.userId,
  //   });

  //   if (!isInFollowersList) {
  //     const updateFollowingList = await User.findByIdAndUpdate(
  //       { _id: id },
  //       {
  //         $push: { followers: req.user.userId },
  //       },
  //       { new: true }
  //     );
  //   }
});

//following list
// const followersList = catchAsync(async (req, res, next) => {
//   const users = await User.find({ following: req.user.userId }).select("_id");

//   const updateFollowingList = await User.findOne(
//     { _id: req.user.userId },
//     {
//       followers: users,
//     },
//     { new: true }
//   );

//   //   res.status(200).json({ msg: "Followers list updated" });
// });

module.exports = { followUser };
