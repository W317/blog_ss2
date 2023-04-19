import Product from "../app/models/productModel.js";
import asyncHandler from 'express-async-handler';
import express from 'express';
import path from "path";

const router = express.Router();
const __dirname = path.resolve()

router.get('', asyncHandler(async(req, res, next) => {
    try {
        const product = await Product.find({}).lean()
        res.render(path.join(__dirname + "/src/views/home.handlebars"), {
            layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
            product: product
          })
    } catch (error) {
        console.log(error);
    }
}));

export default router;
