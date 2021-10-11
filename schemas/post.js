const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },

    submitDate: {
        type: Number,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Posts', postSchema)