import express from 'express';
import { createProduct, getOneProduct, updateProduct, deleteProduct } from '../app/controllers/ProductController.js';
import path from "path";
import upload from '../app/middleware/uploadFile.js';
import { getAllProducts, getAllUser, getAllBlogs } from '../app/controllers/AdminController.js';
import { createBlog } from '../app/controllers/BlogController.js';

const router = express.Router();
const __dirname = path.resolve()

// blog admin
router.get('/blog-admin', getAllBlogs)

router.get('/blog-admin/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-blog.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})

router.post('/blog-admin/create', upload, createBlog);


// user admin
router.get('/user', getAllUser)



// product admin
router.get('/product-admin/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-product.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})
// read all product
router.get('/product-admin', getAllProducts);

// create a product
router.post('/product-admin/create', upload, createProduct);

// read a product by id
router.get('/:id', getOneProduct);

// update a product by id
router.put('/update/:id', updateProduct);

// delete a product by id
router.delete('/delete/:id', deleteProduct);




export default router;