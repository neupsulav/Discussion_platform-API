const mongoose = require("mongoose");
const user = require("./user");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  postImages: [
    {
      type: String,
    },
  ],
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentItem",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", postSchema);
