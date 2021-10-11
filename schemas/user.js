const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  password: String,
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);