import blogRouter from "./blogRoute.js";
import userRouter from "./userRoute.js";
import cartRoute from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import BlogSchema from "../app/models/blogModel.js";
import authRoute from './AuthRoute.js'
import productRoute from "./ProductRoute.js"
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

  app.use("/user", authRoute)

  app.use("/shop", productRoute)
}
