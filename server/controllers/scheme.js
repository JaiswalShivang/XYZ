const User = require("../models/User");
const Scheme = require("../models/Scheme");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");

// Test endpoint to check authentication
exports.testAuth = async (req, res) => {
  try {
    console.log('Test auth - User:', req.user);
    console.log('Test auth - JWT_SECRETS:', process.env.JWT_SECRETS ? 'Set' : 'Not set');
    return res.status(200).json({
      success: true,
      message: "Authentication working",
      user: req.user
    });
  } catch (error) {
    console.log('Test auth error:', error);
    return res.status(500).json({
      success: false,
      message: "Test auth failed"
    });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const { title, description, department, benefits, howtoapply, link, tags } =
      req.body;

    if (
      !title ||
      !description ||
      !department ||
      !benefits ||
      !howtoapply ||
      !link ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const id = req.user.id;
    const checkadmin = await User.findById(id);
    console.log("Admin details : ", checkadmin);

    if (!checkadmin || checkadmin.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    let uploadedImages = [];
    if (req.files && req.files.schemeimage) {
      const files = req.files.schemeimage;

      if (Array.isArray(files)) {
        for (const file of files) {
          const uploaded = await uploadImagetoCloudinary(
            file,
            process.env.FOLDER_NAME
          );
          uploadedImages.push(uploaded.secure_url);
        }
      } else {
        const uploaded = await uploadImagetoCloudinary(
          files,
          process.env.FOLDER_NAME
        );
        uploadedImages.push(uploaded.secure_url);
      }
    }

    const newScheme = await Scheme.create({
      title,
      description,
      department,
      benefits,
      howtoapply,
      link,
      tags,
      createdBy: checkadmin._id,
      schemeimages: uploadedImages,
    });
    return res.status(201).json({
      success: true,
      data: newScheme,
      message: "Scheme created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in creating Scheme",
    });
  }
};

exports.getallScheme = async (req, res) => {
  try {
    const allScheme = await Scheme.find({});

    return res.status(200).json({
      success: true,
      data: allScheme,
      message: "All scheme fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error in fetching all schemes",
    });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    const schemeid = req.params.id;
    console.log('Delete request for scheme ID:', schemeid);
    console.log('User making request:', req.user);

    if (!schemeid) {
      return res.status(400).json({
        success: false,
        message: "Scheme ID is required",
      });
    }

    // Check if the scheme exists first
    const existingScheme = await Scheme.findById(schemeid);
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const deletescheme = await Scheme.findByIdAndDelete(schemeid);
    if (!deletescheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found or already deleted",
      });
    }

    console.log('Scheme deleted successfully:', deletescheme._id);

    return res.status(200).json({
      success: true,
      data: deletescheme,
      message: "Scheme deleted successfully",
    });
  } catch (error) {
    console.log('Error in deleteScheme:', error.message);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting scheme",
    });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    const schemeId = req.params.id;

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    let uploadedImages = scheme.schemeimages;
    if (req.files && req.files.schemeimage) {
      uploadedImages = [];

      const files = req.files.schemeimage;
      if (Array.isArray(files)) {
        for (const file of files) {
          const uploaded = await uploadImagetoCloudinary(
            file,
            process.env.FOLDER_NAME
          );
          uploadedImages.push(uploaded.secure_url);
        }
      } else {
        const uploaded = await uploadImagetoCloudinary(
          files,
          process.env.FOLDER_NAME
        );
        uploadedImages.push(uploaded.secure_url);
      }
    }

    const { title, description, department, benefits, howtoapply, link, tags } =
      req.body;

    const updatedData = {
      title,
      description,
      department,
      benefits,
      howtoapply,
      link,
      tags: tags,
      schemeimages: uploadedImages,
    };

    const updatedScheme = await Scheme.findByIdAndUpdate(schemeId, updatedData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      data: updatedScheme,
      message: "Scheme updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating scheme",
    });
  }
};
