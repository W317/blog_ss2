import express from 'express';
import { getProducts, getOneProduct, updateProduct, deleteProduct, getProductData } from '../app/controllers/ProductController.js';

const router = express.Router();


//read all products
router.get('/', getProducts);

router.post('/', getProducts);

router.get('/data', getProductData)

// read a product by id
router.get('/product/:id', getOneProduct);

// update a product by id
router.put('/update/:id', updateProduct);

// delete a product by id
router.delete('/delete/:id', deleteProduct);

export default router;