const jwt = require("jsonwebtoken")
require("dotenv").config()

// auth middleware
exports.isAuth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRETS);
      console.log(decode);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// user middleware
exports.isUser = async (req,res,next) => {
  try {
    if(req.user.role !== "User"){
      return res.status(403).json({
        success:false,
        message:"This is protected routes for users only"
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"User role cannot be verified, please try again"
    })
  }
}

// admin middleware
exports.isAdmin = async (req,res,next) => {
  try {
    if(req.user.role !== "Admin"){
      return res.status(403).json({
        success:false,
        message:"This is protected routes for admin only"
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"User role cannot be verified, please try again"
    })
  }
}