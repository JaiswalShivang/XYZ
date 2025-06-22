const mongoose = require('mongoose')

const SchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    eligibility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Eligibility",
    },
    benefits: {
      type: String,
      required: true,
    },
    howtoapply: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    schemeimages: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme",SchemeSchema)