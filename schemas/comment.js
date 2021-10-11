//댓글 작업함
const mongoose = require('mongoose')

const { Schema } = mongoose
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
    commentDesc: {
        type: String,
        required: true,
    },
    commentUserId: {
        type: String,
        required: true,
    },
    commentDate: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Comment', commentSchema)
