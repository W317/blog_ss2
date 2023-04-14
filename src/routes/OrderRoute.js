import express from 'express';
import { getAllOrders, getOrderDetails } from '../app/controllers/OrderController.js';
import { isAdmin, isLoggedIn } from './cartRoute.js';

const router = express.Router();


//read all products
router.get('/', isLoggedIn, isAdmin, getAllOrders);

router.get('/:id', isLoggedIn, isAdmin, getOrderDetails)

// // read a product by id
// router.get('/:id', getOneProduct);

// // update a product by id
// router.put('/update/:id', updateProduct);

// // delete a product by id
// router.delete('/delete/:id', deleteProduct);

export default router;