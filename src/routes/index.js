import blogRouter from "./blogRoute.js";
import adminRoute from "./AdminRoute.js";
import userRouter from "./userRoute.js";
import cartRoute, { isLoggedIn } from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import BlogSchema from "../app/models/blogModel.js";
import authRoute from './AuthRoute.js'
import productRoute from "./ProductRoute.js"
import orderRoute from "./OrderRoute.js"
import homeRoute from "./HomeRoute.js"
import path from "path";
import wishlistRoute from './wishlistRoute.js'
import { getUserOrders } from "../app/controllers/OrderController.js";

export default function route(app) {
  app.use("/pages/blog", blogRouter);

  app.use("/pages/user", userRouter);

  app.use("/cart", cartRoute);

  app.use("/admin", adminRoute);

  app.use("/user", authRoute)

  app.use("/shop", productRoute)

  app.use("/", homeRoute)
  app.get("/user/order", isLoggedIn, getUserOrders)
  app.use("/", wishlistRoute)
}
