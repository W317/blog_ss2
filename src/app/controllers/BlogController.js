import BlogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";

const __dirname = path.resolve()

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    // pagination with 2 rows a page
    const PAGE_SIZE = 6;
    let page = req.query.page;
    //count total page
    const totalData = await BlogModel.countDocuments();
    const totalPage = Math.ceil(totalData / PAGE_SIZE);

    // if (page) {
      if (page < 1) {
        page = 1;
      }
      if (page > totalPage) {
        page = totalPage
      }
      page = parseInt(page);
      const skipData = (page - 1) * PAGE_SIZE;
      const blogs = await BlogModel.find()
        .lean()
        .skip(skipData)
        .limit(PAGE_SIZE);

      const pages = [];
      for (let i = 1; i < totalPage + 1; i++) {
        pages.push(i);
      }

      // push 3 blogs into a row
      let blogArray = [];
      let arraySize = 3;
      for (let index = 0; index < blogs.length; index += arraySize) {
        blogArray.push(blogs.slice(index, index + arraySize));
      }

      // for button pre and next in pagination
      let currentPage = parseInt(req.query.page)
      if (!page) {
        currentPage = 1
      }
      const hasPrev = currentPage > 1;
      const prev = currentPage - 1;

      const hasNext = currentPage < totalPage;
      const next = currentPage + 1;

      const isActive = (page) => {
        return currentPage === page;
      };

      // render view
      res.render(path.join(__dirname + "/src/views/blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs: blogArray,
        pages: pages.map((page) => ({
          page,
          active: isActive(page),
        })),
        currentPage,
        hasPrev,
        prev,
        hasNext,
        next
      })
  
  } catch (error) {
    console.log(error);
  }
});

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { author, title, body, href } = req.body;
    // if (!author || !title || !body || !href) {
    //   throw new Error("Error !!!")
    // }
    const imagePath = req.file ? `/img/${req.file.filename}` : ''; // save the file path if a file was uploaded

    const blog = new BlogModel({
      author: author,
      title: title,
      body: body,
      image: imagePath,
      href: href
    });

    await blog.save();
    res.status(201).redirect('/admin/blog-admin');
  } catch (err) {
    console.log(err);
  }
});

const getEditBlog = asyncHandler(async (req, res) => {
  try {
      const blog = await BlogModel.findById(req.params.id).lean();
      res.render(path.join(__dirname + "/src/views/blog-admin.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
        blog : blog
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
})

const updateBlog = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if a new file was uploaded
    if (req.file) {
      // Get the full path to the img directory
      const filePath = path.join(__dirname, '/public', req.body.old_image);

      fs.unlinkSync(filePath);


      // If a new file was uploaded, delete the old image
      const imagePath = req.file ? `/img/${req.file.filename}` : "";
      // Update the product's image with the new file
      blog.image = imagePath;
      console.log('this is ' + blog.image)
      await product.save();
    }

    res.status(302).redirect("/admin/blog-admin");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(204).redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

export { createBlog, getAllBlogs, deleteBlog, updateBlog, getEditBlog };
