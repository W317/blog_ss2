import express from 'express'
import { isLoggedIn } from './cartRoute.js'
import { addToWishlist, getAllWishList, removeFromWishlist } from '../app/controllers/WishlistController.js'
const router = express.Router()

router.get('/user/wishlist', isLoggedIn, getAllWishList)

router.get('/user/add-to-wishlist/:productId', isLoggedIn, addToWishlist)

router.get('/user/remove-from-wishlist/:productId', isLoggedIn, removeFromWishlist)


export default router