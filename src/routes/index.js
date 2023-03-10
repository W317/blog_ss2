import blogRouter from "./blogRoute.js";
import userRouter from "./userRoute.js";
import cartRoute from "./cartRoute.js";
import asyncHandler from "express-async-handler";
import BlogSchema from "../app/models/blogModel.js";
import authRoute from './AuthRoute.js'
import path from "path";

const __dirname = path.resolve()
export default function route(app) {
  app.use("/blog", blogRouter);

  app.use("/cart", cartRoute);

  app.get(
    "/",
    asyncHandler(async (req, res) => {
      const blogs = await BlogSchema.find({});
      const __dirname = path.resolve()

      res.render(path.join(__dirname + "/src/views/index.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
        blogs: blogs,
      });
    })
  );

  app.use("/user", authRoute)
}
