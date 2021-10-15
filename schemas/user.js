const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userIntro: {
        type: String,
    },
    userPic: {
        type: String,
    },
})

userSchema.virtual('userObjectId').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true,
})

module.exports = mongoose.model('User', userSchema)
