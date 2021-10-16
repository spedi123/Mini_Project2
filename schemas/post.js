const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    youtube_url: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    video_url: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
})

postSchema.virtual('postId').get(function () {
    return this._id.toHexString()
})

postSchema.set('toJSON', {
    virtuals: true,
})

module.exports = mongoose.model('Posts', postSchema)
