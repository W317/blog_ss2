import asyncHandler from "express-async-handler";
import Wishlist from "../models/wishlistModel.js";
import path from "path";
import Product from "../models/productModel.js";
const __dirname = path.resolve();
const getAllWishList = asyncHandler(async (req, res) => {
  const user = req.session?.passport?.user;
  const wishlist = await Wishlist.findOne({ user: user }).lean();

  res.render(path.join(__dirname + "/src/views/wishlist.handlebars"), {
    wishlist: wishlist.wishlist,
    isEmpty: wishlist.wishlist.length ? "" : "Your wishlist is empty",
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const user = req.session?.passport?.user;
    const wishlistPro = req.params.productId;

    const product = await Product.findById(wishlistPro);
    const wishlist = await Wishlist.findOne({ user: user });

    if (wishlist !== null) {
      wishlist.wishlist.forEach((item) => {
        if (item.title !== product.title) {
          wishlist.wishlist = [...wishlist.wishlist, product];
        }
      });

      await wishlist.save();
    } else {
      const newWishlist = await Wishlist.create({
        user: user,
        wishlist: [product],
      });

      await newWishlist.save();
    }

    res.redirect("/user/wishlist");
  } catch (error) {
    throw new Error(error.toString());
  }
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = req.session?.passport?.user;

    const wishlist = await Wishlist.findOne({ user: user });
    const product = await Product.findById(productId)
    const filtered = wishlist.wishlist.filter((item) => {
      return item.title !== product.title
    })

    wishlist.wishlist = filtered

    await wishlist.save();

    res.redirect("/user/wishlist");
  } catch (error) {
    throw new Error(error.toString());
  }
});

export { getAllWishList, addToWishlist, removeFromWishlist };
