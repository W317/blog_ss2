import blogRouter from "./blogRoute.js";
import adminRoute from "./AdminRoute.js";
import userRouter from "./userRoute.js";
import cartRoute from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import authRoute from './AuthRoute.js'
import productRoute from "./ProductRoute.js"
import path from "path";

const __dirname = path.resolve()
export default function route(app) {
  app.use("/pages/blog", blogRouter);

  app.use("/cart", cartRoute);

  app.use("/admin", adminRoute);

  app.use("/user", authRoute)

  app.use("/shop", productRoute)
}
