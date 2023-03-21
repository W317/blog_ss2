import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";

const __dirname = path.resolve()

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().lean(); // Add .lean() method here
    let productArray = [];
    let arraySize = 3;
    for (let index = 0; index < products.length; index+=arraySize) {
      productArray.push(products.slice(index, index+arraySize));
    }
    res.render(path.join(__dirname + "/src/views/shop.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      products: productArray
    })
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
        image: listImage[1],
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
  