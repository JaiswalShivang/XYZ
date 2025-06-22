const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      enum: ["User", "Admin"],
      type: String,
      default: "User",
    },
    additionaldetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdditionalDetails",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User",UserSchema)