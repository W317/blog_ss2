import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";

const __dirname = path.resolve()

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    if (products) {
      res.render(path.join(__dirname + "/src/views/shop.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        products: products
      })
    }
  } catch (error) {
    console.log(error);
  }
});

const createProduct = asyncHandler(async (req, res) => {
    try {
      const { title, category, images, description, price } = req.body;
      // if (!category || !title || !price || !description || !images) {
      //   throw new Error("Error !!!")
      // }
      const product = new Product({
        title: title,
        category: category,
        images: [],
        description: description,
        price: price,
        
      });
      const createProduct = await product.save();
      res.status(201).json(createProduct);
    } catch (err) {
      console.log(err);
    }
  });
  
  export { createProduct, getProducts };
  