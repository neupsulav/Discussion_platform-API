const mongoose = require("mongoose");

const commentItemSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  commentText: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CommentItem", commentItemSchema);
