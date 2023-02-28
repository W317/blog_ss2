import BlogModel from "../models/blog.js";
import asyncHandler from 'express-async-handler'

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await BlogModel.find({});
    if (blogs) {
      res.status(200).json({
        data: blogs,
        success: true
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    } 
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error
      });
  }
});

export {getAllBlogs}