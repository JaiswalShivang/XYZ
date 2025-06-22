const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt =  require("jsonwebtoken")
require("dotenv").config()

// signup controller
exports.signup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    
    const { name, email, password, confirmpassword, role, phone } = req.body;

    if (!name || !email || !password || !confirmpassword || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password != confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm password is not matching",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Signup successful",
    });
  } catch (error) {
    console.log('Signup error:', error.message);
    console.log('Error stack:', error.stack);
    
    // Check for specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or phone number",
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + Object.values(error.errors).map(err => err.message).join(', '),
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal Server error in signup",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// login controller
exports.login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      // Check if JWT_SECRETS is set
      if (!process.env.JWT_SECRETS) {
        console.error('JWT_SECRETS environment variable is not set!');
        return res.status(500).json({
          success: false,
          message: "Server configuration error: JWT secret not set",
        });
      }

      let token = jwt.sign(payload, process.env.JWT_SECRETS, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log('Login error:', error.message);
    console.log('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error in login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};