import Product from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import asyncHandler from 'express-async-handler'
import path from "path";
import { multipleMongooseToObject } from "../../util/mongoose.js";
import CategoryModel from "../models/categoryModel.js";
const __dirname = path.resolve()


const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const PAGE_SIZE = 12;
        let page = req.query.page;
        //count total page
        const totalData = await Product.countDocuments();
        const totalPage = Math.ceil(totalData / PAGE_SIZE);

        // if (page) {
        if (page < 1) {
            page = 1;
        }
        if (page > totalPage) {
            page = totalPage
        }
        page = parseInt(page);
        const skipData = (page - 1) * PAGE_SIZE;
        const products = await Product.find()
            .skip(skipData)
            .limit(PAGE_SIZE);

        const pages = [];
        for (let i = 1; i < totalPage + 1; i++) {
            pages.push(i);
        }

        // for button pre and next in pagination
        let currentPage = parseInt(req.query.page)
        if (!page) {
            currentPage = 1
        }
        const hasPrev = currentPage > 1;
        const prev = currentPage - 1;

        const hasNext = currentPage < totalPage;
        const next = currentPage + 1;

        const isActive = (page) => {
            return currentPage === page;
        };
        
        res.render(path.join(__dirname + "/src/views/product-dashboard.handlebars"), {
            layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
            products: multipleMongooseToObject(products),
            pages: pages.map((page) => ({
                page,
                active: isActive(page),
            })),
            currentPage,
            hasPrev,
            prev,
            hasNext,
            next
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  });

const getEditProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        const category = await CategoryModel.find({}).lean()
        // console.log(listCate);
        res.render(path.join(__dirname + "/src/views/edit-product.handlebars"), {
          layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
          product: product,
          category: category
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const PAGE_SIZE = 12;
        let page = req.query.page;
        //count total page
        const totalData = await userModel.countDocuments();

        const totalPage = Math.ceil(totalData / PAGE_SIZE);

        // if (page) {
        if (page < 1) {
            page = 1;
        }
        if (page > totalPage) {
            page = totalPage
        }
        page = parseInt(page);
        const skipData = (page - 1) * PAGE_SIZE;
        const users = await userModel.find()
            .skip(skipData)
            .limit(PAGE_SIZE);

        const pages = [];
        for (let i = 1; i < totalPage + 1; i++) {
            pages.push(i);
        }

        // for button pre and next in pagination
        let currentPage = parseInt(req.query.page)
        if (!page) {
            currentPage = 1
        }
        const hasPrev = currentPage > 1;
        const prev = currentPage - 1;

        const hasNext = currentPage < totalPage;
        const next = currentPage + 1;

        const isActive = (page) => {
            return currentPage === page;
        };
        
        res.render(path.join(__dirname + "/src/views/user.handlebars"), {
            layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
            users: multipleMongooseToObject(users),
            pages: pages.map((page) => ({
                page,
                active: isActive(page),
            })),
            currentPage,
            hasPrev,
            prev,
            hasNext,
            next
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  })

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const PAGE_SIZE = 12;
        let page = req.query.page;
        //count total page
        const totalData = await Blog.countDocuments();
        const totalPage = Math.ceil(totalData / PAGE_SIZE);

        // if (page) {
        if (page < 1) {
            page = 1;
        }
        if (page > totalPage) {
            page = totalPage
        }
        page = parseInt(page);
        const skipData = (page - 1) * PAGE_SIZE;
        const blogs = await Blog.find()
            .skip(skipData)
            .limit(PAGE_SIZE);

        const pages = [];
        for (let i = 1; i < totalPage + 1; i++) {
            pages.push(i);
        }

        // for button pre and next in pagination
        let currentPage = parseInt(req.query.page)
        if (!page) {
            currentPage = 1
        }
        const hasPrev = currentPage > 1;
        const prev = currentPage - 1;

        const hasNext = currentPage < totalPage;
        const next = currentPage + 1;

        const isActive = (page) => {
            return currentPage === page;
        };
        
        res.render(path.join(__dirname + "/src/views/blog-admin.handlebars"), {
            layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
            blogs: multipleMongooseToObject(blogs),
            pages: pages.map((page) => ({
                page,
                active: isActive(page),
            })),
            currentPage,
            hasPrev,
            prev,
            hasNext,
            next
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  });

export {getAllProducts, getEditProduct, getAllUser, getAllBlogs}