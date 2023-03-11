import express from 'express';
import { getProducts } from '../app/controllers/ProductController.js';
import { createProduct } from '../app/controllers/ProductController.js';

const router = express.Router();

router.get('/', getProducts);

router.post('/create', createProduct);

export default router;