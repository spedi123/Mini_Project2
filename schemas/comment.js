const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  commentDesc: {
    type: String,
    required: true,
  },
  commentDate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
