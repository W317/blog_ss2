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

const listImage = [
  '/img/dior1.jpg',
  '/img/gucci-cate.jpeg',
  '/img/dior1.jpg',
]

const createProduct = asyncHandler(async (req, res) => {
    try {
      const { title, category, description, price, quantity } = req.body;

      const product = new Product({
        quantity: quantity,
        title: title,
        category: category,
        images: [],
        description: description,
        price: price,
      });
      await product.save();
      res.status(201).redirect('/shop');
    } catch (err) {
      console.log(err);
    }
  });
  
  export { createProduct, getProducts };
  