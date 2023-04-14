import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'

import path from "path";
import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";

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

      console.log(req.session)

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

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // const user = await userModel.findById(req.session?.passport.user)

    const orders = await Order?.find({})
    // const orders = await Order?.find({user: user?._id})
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      orders: orders,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    })
  } catch(err) {
    res.redirect("/")
  }
})
const listImage = [
  '/img/ysl3.jpg',
]


const getOrderDetails = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    console.log('order', order);
    const user = await userModel.findById(order.user).lean();
    console.log('user', user);
    if (!order) {
      res.redirect("/admin/order")
    }
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      order: order,
      user: user,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    })
  } catch (error) {
    console.error(error);
    res.redirect("/admin/order")
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

export { getAllOrders, getOrderDetails };
