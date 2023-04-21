import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

import path from "path";
import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const __dirname = path.resolve();
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // const user = await userModel.findById(req.session?.passport.user)

    const orders = await Order?.find({});
    // const orders = await Order?.find({user: user?._id})
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      orders: orders,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    });
  } catch (err) {
    res.redirect("/");
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.passport.user });
    console.log('order', orders);

    // console.log('order', orders);
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      orders: orders,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    });
  } catch (error) {
    console.log(error);
  }
});

const getOrderDetails = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    const user = await userModel.findById(order.user).lean();
    if (!order) {
      res.redirect("/admin/order");
    }
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      order: order,
      user: user,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    });
  } catch (error) {
    console.error(error);
    res.redirect("/admin/order");
  }
});

export { getAllOrders, getOrderDetails, getUserOrders };
