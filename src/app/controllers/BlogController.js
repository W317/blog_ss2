import BlogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";

const __dirname = path.resolve()

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
      const blogs = await BlogModel.find().lean(); // Add .lean() method here
      let blogChunk = [];
      let chunkSize = 3;
      for (let index = 0; index < blogs.length; index+=chunkSize) {
        blogChunk.push(blogs.slice(index, index+chunkSize));
      }
      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs: blogChunk
      })
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
