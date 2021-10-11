const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    id: {
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}})
userSchema.virtual('userId').get(function () {
    return this._id.toHexString()
})
userSchema.set('toJSON', {
    virtuals: true,
})
// userSchema.virtual('userId').get(function () {
//     return this._id.toHexString()
// })
// userSchema.set('toJSON', {
//     virtuals: true,
// })
module.exports = mongoose.model('User', userSchema)