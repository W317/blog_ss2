import express from 'express';
import { createProduct, getOneProduct, updateProduct, deleteProduct } from '../app/controllers/ProductController.js';
import path from "path";
import upload from '../app/middleware/uploadFile.js';
import { getAllProducts } from '../app/controllers/AdminController.js';

const router = express.Router();
const __dirname = path.resolve()

router.get('/create', (req, res) => {
    res.render(path.join(__dirname + "/src/views/form-product.handlebars"), {
        layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
    });
})
// read all product
router.get('/', getAllProducts);

// create a product
router.post('/create', upload, createProduct);

// read a product by id
router.get('/:id', getOneProduct);

// update a product by id
router.put('/update/:id', updateProduct);

// delete a product by id
router.delete('/delete/:id', deleteProduct);

export default router;