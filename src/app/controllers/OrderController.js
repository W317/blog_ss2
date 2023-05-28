import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { multipleMongooseToObject } from "../../util/mongoose.js";

import path from "path";
import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const __dirname = path.resolve();
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order?.find();
    res.render(path.join(__dirname + "/src/views/session.handlebars"), {
      orders: multipleMongooseToObject(orders),
      layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
  } catch (err) {
    res.redirect("/");
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.passport.user }).lean();

    res.render(path.join(__dirname + "/src/views/user-order.handlebars"), {
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
    const user = await userModel.findById(req?.session?.passport?.user).lean();
    if (!order) {
      res.redirect("/admin/order");
    }
    res.render(path.join(__dirname + "/src/views/orderDetail.handlebars"), {
      order: order,
      user: user,
      isAdmin: user?.isAdmin,
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    });
  } catch (error) {
    console.error(error);
    res.redirect("/admin/order");
  }
});

const updateOrderDetails = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const user = await userModel.findById(req?.session?.passport?.user);
    if (!order) {
      res.redirect("/admin/order");
    }

    if(!user?.isAdmin) {
      res.redirect("/");
    }

    const {status} = req?.body
    if(order) {
      order.status = status
    }

    await order.save()
    res.redirect(`/admin/order`)
  } catch (error) {
    console.error(error);
    res.redirect("/admin/order");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.deleteOne({
      _id: req?.params?.id
    })
    res.redirect(`/admin/order`)
  } catch (error) {
    console.error(error);
    res.redirect("/admin/order");
  }
});

export { getAllOrders, getOrderDetails, getUserOrders, updateOrderDetails, deleteOrder };
