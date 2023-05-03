import express from 'express';
import { createProduct, getOneProduct, updateProduct, deleteProduct, deleteManyProduct } from '../app/controllers/ProductController.js';
import path from "path";
import upload from '../app/middleware/uploadFile.js';
import { getAllProducts, getEditProduct, getAllUser, getAllBlogs } from '../app/controllers/AdminController.js';
import { createBlog, deleteBlog, updateBlog, getEditBlog, deleteManyBlog } from '../app/controllers/BlogController.js';
import { deleteUser } from '../app/controllers/UserController.js';
import { deleteOrder, getAllOrders, getOrderDetails, updateOrderDetails } from '../app/controllers/OrderController.js';
import { isAdmin, isLoggedIn } from './cartRoute.js';
import { createCategory, createCategoryView, deleteCateDetail, deleteManyCate, getAllCategory, getCateDetail, updateCateDetail } from '../app/controllers/CategoryController.js';
import CategoryModel from '../app/models/categoryModel.js';
import asyncHandler from 'express-async-handler'
import userModel from '../app/models/userModel.js';
import Order from '../app/models/orderModel.js';
import Product from '../app/models/productModel.js';

const router = express.Router();
const __dirname = path.resolve()

// Dashboard
router.get('/dashboard', asyncHandler(async(req, res, next) => {
    try {
        const userCount = await userModel.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        res.render(path.join(__dirname + "/src/views/dashboard.handlebars"), {
                layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"
        ),
        userCount,
        productCount,
        orderCount
        })
    } catch (error) {
        console.log(error);
    }
}));


// BLOG ADMIN
router.get('/blog-admin', getAllBlogs)
router.get('/blog-admin/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})
router.post('/blog-admin/create', upload, createBlog);
router.delete('/blog-admin/delete-multiple', deleteManyBlog);
router.put('/blog-admin/update/:id', upload, updateBlog);
router.get('/blog-admin/edit/:id', getEditBlog);
router.delete('/blog-admin/delete/:id', deleteBlog);




// ORDER FOR ADMIN
router.get('/order',isLoggedIn, isAdmin, getAllOrders)
router.get('/order/:id', isLoggedIn, isAdmin, getOrderDetails)
router.post('/order/:id', isLoggedIn, isAdmin, updateOrderDetails)
router.get('/order/:id/delete', isLoggedIn, isAdmin, deleteOrder)




// CATEGORY
router.get('/category', isLoggedIn, isAdmin, getAllCategory)
router.get('/category/create', isLoggedIn, isAdmin, createCategoryView)
router.post('/category/create', isLoggedIn, isAdmin, createCategory)
router.get('/category/edit/:id', isLoggedIn, isAdmin, getCateDetail)
router.post('/category/edit/:id', isLoggedIn, isAdmin, updateCateDetail)
router.delete('/category/delete/:id', isLoggedIn, isAdmin, deleteCateDetail)
router.delete('/category/delete-multiple', isLoggedIn, isAdmin, deleteManyCate)


// USER ADMIN
router.get('/user', getAllUser)
router.delete('/user/delete/:id', deleteUser);


// PRODUCT ADMIN

router.get('/product-admin', getAllProducts);
router.post('/product-admin/create', upload, createProduct);
router.get('/product-admin/create', asyncHandler(async(req, res, next) => {
    try {
        const category = await CategoryModel.find({}).lean()
        res.render(path.join(__dirname + "/src/views/create-product.handlebars"), {
            layout: path.join(
              __dirname + "/src/views/layout/admin-sidebar.handlebars"
            ),
            category: category
          })
    } catch (error) {
        console.log(error);
    }
}));
router.put('/product-admin/update/:id', upload, updateProduct);
router.get('/product-admin/edit/:id', getEditProduct);
router.get('/:id', getOneProduct);
router.delete('/product-admin/delete-multiple', deleteManyProduct);
router.delete('/product-admin/delete/:id', deleteProduct);










export default router;