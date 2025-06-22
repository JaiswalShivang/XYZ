const Scheme = require("../models/Scheme");
const Eligibility = require("../models/Eligibility");

exports.createEligibility = async (req, res) => {
  try {
    const {
      schemeId,
      state,
      city,
      category,
      gender,
      familyincome,
      agelimit,
      educationalbackground,
    } = req.body;

    if (
      !schemeId ||
      !state ||
      !city ||
      !category ||
      !gender ||
      !familyincome ||
      !agelimit ||
      !educationalbackground
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const eligibilitydetails = await Eligibility.create({
      state,
      city,
      category,
      gender,
      familyincome,
      agelimit,
      educationalbackground,
    });

    const updatedScheme = await Scheme.findByIdAndUpdate(
      schemeId,
      {
        eligibility: eligibilitydetails._id,
      },

      { new: true }
    ).populate("eligibility");

    if (!updatedScheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }
    console.log("Updated Scheme : ", updatedScheme);

    return res.status(200).json({
      success: true,
      message: "Eligibility created successfully",
      data: updatedScheme,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error in creating eligibility",
    });
  }
};
