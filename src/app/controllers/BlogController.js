import BlogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";

const __dirname = path.resolve()

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    // pagination with 2 rows a page
    const PAGE_SIZE = 6;
    let page = req.query.page;

    if (page) {
      if (page < 1) {
        page = 1;
      }
      page = parseInt(page);
      const skipData = (page - 1) * PAGE_SIZE;
      const blogs = await BlogModel.find()
        .lean()
        .skip(skipData)
        .limit(PAGE_SIZE);

      //count total page
      const totalData = await BlogModel.countDocuments();
      const totalPage = Math.ceil(totalData/PAGE_SIZE);
      console.log(totalPage);

      // push 3 blogs into a row
      let blogArray = [];
      let arraySize = 3;
      for (let index = 0; index < blogs.length; index += arraySize) {
        blogArray.push(blogs.slice(index, index + arraySize));
      }

      // render view
      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs : blogArray
      })


    } else {
      const blogs = await BlogModel.find().lean(); // Add .lean() method here
      let blogArray = [];
      let arraySize = 3;
      for (let index = 0; index < blogs.length; index += arraySize) {
        blogArray.push(blogs.slice(index, index + arraySize));
      }

      //Insert multiple documents of ProductModel using loop (fake data)
      // let blogData = [];
      // for (let i = 0; i < 20; i++) { //loop through 10 products
      //   const blog = new BlogModel({
      //     author: `Author ${i}`,
      //     title: 'abc'+i,
      //     body: 'body'+i,
      //     images: [],
      //     href: 'href'+i
      //   });
      //   blogData.push(blog);
      // }
      // const result = await BlogModel.insertMany(blogData);
      // console.log(result)

      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs: blogArray
      })
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
    const blogImages = [
      '/img/blog3.jpg'
    ]

    const blog = new BlogModel({
      author: author,
      title: title,
      body: body,
      image: blogImages[0],
      href: href,
    });
    const createBlog = await blog.save();
    res.status(201).json(createBlog);
  } catch (err) {
    console.log(err);
  }
});

export { createBlog, getAllBlogs };
