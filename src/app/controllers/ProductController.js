import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'

import path from "path";

 const __dirname = path.resolve()

const getProducts = asyncHandler(async (req, res) => {
  try {
    // pagination with 2 rows a page
    const PAGE_SIZE = 6;
    let page = req.query.page;
    //count total page
    const totalData = await Product.countDocuments();
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
      const products = await Product.find()
        .lean()
        .skip(skipData)
        .limit(PAGE_SIZE);

      const pages = [];
      for (let i = 1; i < totalPage + 1; i++) {
        pages.push(i);
      }
      console.log(pages);
      console.log(totalPage);

      // push 3 blogs into a row
      let productArray = [];
      let arraySize = 3;
      for (let index = 0; index < products.length; index += arraySize) {
        productArray.push(products.slice(index, index + arraySize));
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

      // render view
      res.render(path.join(__dirname + "/src/views/shop.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        products: productArray,
        pages: pages,
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

const listImage = [
  '/img/ysl3.jpg',
]

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, category, description, price, quantity } = req.body;
    
    const imagePath = req.file ? `img/${req.file.filename}` : ''; // save the file path if a file was uploaded
    
    const product = new Product({
      quantity: quantity,
      title: title,
      category: category,
      image: imagePath,
      description: description,
      price: price,
    });

    await product.save();
    res.status(201).redirect('/shop');
  } catch (err) {
    console.log(err);
  }
});

const getOneProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

export { createProduct, getProducts, getOneProduct, updateProduct, deleteProduct };
