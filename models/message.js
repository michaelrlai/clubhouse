const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String },
  timestamp: { type: String },
  text: { type: String },
});

UserSchema.virtual("url").get(function () {
  return "/message/" + this._id;
});

module.exports = mongoose.model("User", MessageSchema);
