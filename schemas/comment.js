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