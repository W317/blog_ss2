import BlogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await BlogModel.find({});
    if (blogs) {
      res.render(path.join(__dirname + "/src/views/home.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs: blogs
      })
    }
  } catch (error) {
    console.log(error)
  }
});

export { getAllBlogs }