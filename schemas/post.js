const mongoose = require("mongoose");
const { Schema } = mongoose;
const postingSchema = new Schema({
    postId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
    },
    userId: {
        type: String
    },
    url: {
        type: String,
    },
    content: {
        type: String,
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model("Post", postingSchema)