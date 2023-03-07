import BlogModel from "../models/blogModel.js";
import asyncHandler from "express-async-handler";
import path from "path";
import { error } from "console";
const __dirname = path.resolve();

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await BlogModel.find({});
    if (blogs) {
      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogarrays: blogs,
      });
      // res.status(200).json(blogs)
    }
  } catch (error) {
    console.log(error);
  }
});

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { author, title, body, images, href } = req.body;
    // if (!author || !title || !body || !href) {
    //   throw new Error("Error !!!")
    // }
    const blog = new BlogModel({
      author: author,
      title: title,
      body: body,
      images: [],
      href: href,
    });
    const createBlog = await blog.save();
    res.status(201).json(createBlog);
  } catch (err) {
    console.log(err);
  }
});

export { createBlog, getAllBlogs };
