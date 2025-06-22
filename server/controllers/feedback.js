const User = require("../models/User")
const Feedback = require("../models/Feedback")

exports.createFeedback = async (req,res) => {
  try {
    const { message } = req.body
    const userId = req.user.id
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message are required",
      });
    }

    const userExists = await User.findById(userId)
     if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const createdFeedback = await Feedback.create({
      message,
      user: userId,
    });

     return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: createdFeedback,
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error while submitting feedback",
    });
  }
}

exports.getallFeedback = async (req,res) => {
  try {
    const allfeedback = await Feedback.find({}).populate("user", "name email");
    return res.status(200).json({
      success:true,
      data:allfeedback,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success:false,
      message:"Internal server error in fetching all feedback"
    })
  }
}