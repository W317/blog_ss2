import blogRouter from "./blogRoute.js";
import adminRoute from "./AdminRoute.js";
import userRouter from "./userRoute.js";
import cartRoute from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import BlogSchema from "../app/models/blogModel.js";
import authRoute from './AuthRoute.js'
import productRoute from "./ProductRoute.js"
import userRoute from "./userRoute.js"
import orderRoute from "./OrderRoute.js"
import path from "path";

export default function route(app) {
  app.use("/pages/blog", blogRouter);

  app.use("/cart", cartRoute);

  app.use("/admin", adminRoute);

  app.use("/user", authRoute)

  app.use("/shop", productRoute)

  app.use("/admin/order", orderRoute)
}
