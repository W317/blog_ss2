import express from 'express';
import { getProducts, createProduct, getOneProduct, updateProduct, deleteProduct } from '../app/controllers/ProductController.js';

const router = express.Router();


//read all products
router.get('/', getProducts);

router.post('/', getProducts)

// read a product by id
router.get('/:id', getOneProduct);

// update a product by id
router.put('/update/:id', updateProduct);

// delete a product by id
router.delete('/delete/:id', deleteProduct);

export default router;