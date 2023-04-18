import express from 'express';
import { createProduct, getOneProduct, updateProduct, deleteProduct } from '../app/controllers/ProductController.js';
import path from "path";
import upload from '../app/middleware/uploadFile.js';
import { getAllProducts, getEditProduct, getAllUser, getAllBlogs } from '../app/controllers/AdminController.js';
import { createBlog, deleteBlog, updateBlog, getEditBlog } from '../app/controllers/BlogController.js';
import Product from '../app/models/productModel.js';
import { deleteUser } from '../app/controllers/UserController.js';
import { getAllOrders, getOrderDetails } from '../app/controllers/OrderController.js';
import { isAdmin, isLoggedIn } from './cartRoute.js';
import { createCategory, createCategoryView, deleteCateDetail, getAllCategory, getCateDetail, updateCateDetail } from '../app/controllers/CategoryController.js';
import CategoryModel from '../app/models/categoryModel.js';
import asyncHandler from 'express-async-handler'

const router = express.Router();
const __dirname = path.resolve()

// BLOG ADMIN
router.get('/blog-admin', getAllBlogs)

router.get('/blog-admin/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})

router.post('/blog-admin/create', upload, createBlog);

router.put('/blog-admin/update/:id', upload, updateBlog);

router.get('/blog-admin/edit/:id', getEditBlog);

router.delete('/blog-admin/delete/:id', deleteBlog);

// ORDER FOR ADMIN
router.get('/order',isLoggedIn, isAdmin, getAllOrders)

router.get('/order/:id', isLoggedIn, isAdmin, getOrderDetails)


// CATEGORY
router.get('/category', isLoggedIn, isAdmin, getAllCategory)
router.get('/category/create', isLoggedIn, isAdmin, createCategoryView)
router.post('/category/create', isLoggedIn, isAdmin, createCategory)
router.get('/category/edit/:id', isLoggedIn, isAdmin, getCateDetail)
router.post('/category/edit/:id', isLoggedIn, isAdmin, updateCateDetail)
router.get('/category/delete/:id', isLoggedIn, isAdmin, deleteCateDetail)


// USER ADMIN
router.get('/user', getAllUser)


// PRODUCT ADMIN
// read all product
router.get('/product-admin', getAllProducts);

// create a product
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


// update a product by id
router.put('/product-admin/update/:id', upload, updateProduct);

router.get('/product-admin/edit/:id', getEditProduct);


// read a product by id
router.get('/:id', getOneProduct);

// delete a product by id
router.delete('/product-admin/delete/:id', deleteProduct);


// USER ADMIN
router.delete('/user/delete/:id', deleteUser);




export default router;