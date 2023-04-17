import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'

import path from "path";
import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";

 const __dirname = path.resolve()
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
