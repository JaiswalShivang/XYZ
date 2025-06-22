const User = require("../models/User");
const AdditionalDetails = require("../models/AdditionalDetails");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");
require("dotenv").config()

exports.addDetails = async (req, res) => {
  try {
    const {
      userId,
      state,
      city,
      category,
      gender,
      familyincome,
      age,
      educationbackground,
    } = req.body;

     if (!req.files || !req.files.userimage) {
      return res.status(400).json({
        success: false,
        message: "User image is required",
      });
    }

    const userimage = req.files.userimage

    if (
      !userId ||
      !state ||
      !city ||
      !category ||
      !gender ||
      !familyincome ||
      !age ||
      !educationbackground 
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadedImage = await uploadImagetoCloudinary(
              userimage,
              process.env.FOLDER_NAME
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const adddetails = await AdditionalDetails.create({
      state,
      city,
      category,
      gender,
      familyincome,
      age,
      educationbackground,
      userimage:uploadedImage.secure_url
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        additionaldetails: adddetails._id,
      },
      { new: true }
    ).populate("additionaldetails");

    return res.status(200).json({
      success: true,
      message: "Additional details added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error in adding additional details",
    });
  }
};
