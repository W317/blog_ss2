import blogRouter from "./blogRoute.js";
import adminRoute from "./AdminProductRoute.js";
import userRouter from "./userRoute.js";
import cartRoute from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import BlogSchema from "../app/models/blogModel.js";
import authRoute from './AuthRoute.js'
import productRoute from "./ProductRoute.js"
import userRoute from "./AdminUserRoute.js"
import path from "path";

const __dirname = path.resolve()
export default function route(app) {
  app.use("/pages/blog", blogRouter);

  app.use("/cart", cartRoute);

  // app.get(
  //   "/",
  //   asyncHandler(async (req, res) => {
  //     const blogs = await BlogSchema.find({});
  //     const __dirname = path.resolve()
  //   })
  // );
  app.use("/admin/product-admin", adminRoute);

  app.use("admin/user", userRoute)

  app.use("/user", authRoute)

  app.use("/shop", productRoute)
}
