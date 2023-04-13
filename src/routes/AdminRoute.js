import express from 'express';
import { createProduct, getOneProduct, updateProduct, deleteProduct } from '../app/controllers/ProductController.js';
import path from "path";
import upload from '../app/middleware/uploadFile.js';
import { getAllProducts, getEditProduct, getAllUser, getAllBlogs } from '../app/controllers/AdminController.js';
import { createBlog, deleteBlog } from '../app/controllers/BlogController.js';
import Product from '../app/models/productModel.js';
import { deleteUser } from '../app/controllers/UserController.js';

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

router.delete('/blog-admin/delete/:id', deleteBlog);


// USER ADMIN
router.get('/user', getAllUser)



// PRODUCT ADMIN
router.get('/product-admin/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-product.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})
// read all product
router.get('/product-admin', getAllProducts);

// create a product
router.post('/product-admin/create', upload, createProduct);



// update a product by id
router.put('/product-admin/edit/:id', updateProduct);

router.get('/product-admin/edit/:id', getEditProduct);
  


// read a product by id
router.get('/:id', getOneProduct);

// delete a product by id
router.delete('/product-admin/delete/:id', deleteProduct);


// USER ADMIN
router.delete('/user/delete/:id', deleteUser);




export default router;