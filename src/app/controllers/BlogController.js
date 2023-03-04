import BlogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'
import path from 'path'
const __dirname = path.resolve()

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await BlogModel.find({});
    if (blogs) {
      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogarrays: blogs
      })
      // res.status(200).json(blogs)
    }
  } catch (error) {
    console.log(error)
  }
});

export { getAllBlogs }