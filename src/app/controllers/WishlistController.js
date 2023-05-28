import asyncHandler from "express-async-handler";
import Wishlist from "../models/wishlistModel.js";
import path from "path";
import Product from "../models/productModel.js";
const __dirname = path.resolve();
const getAllWishList = asyncHandler(async (req, res) => {
  try {
    const user = req.session?.passport?.user;
    const wishlist = await Wishlist.findOne({ user: user }).lean();

    if (!wishlist) {
      // Wishlist not found for the user
      return res.render(path.join(__dirname + "/src/views/wishlist.handlebars"), {
        wishlist: [],
        isEmpty: "Your wishlist is empty",
        layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      });
    }

    res.render(path.join(__dirname + "/src/views/wishlist.handlebars"), {
      wishlist: wishlist.wishlist,
      isEmpty: wishlist.wishlist.length ? "" : "Your wishlist is empty",
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    });
  } catch (error) {
    console.error(error);
    // Handle the error accordingly
    res.status(500).send("Internal Server Error");
  }
});


const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const user = req.session?.passport?.user;
    const wishlistPro = req.params.productId;

    const product = await Product.findById(wishlistPro);
    const wishlist = await Wishlist.findOne({ user: user });

    if (wishlist !== null) {
      wishlist.wishlist.push(product);
      await Wishlist.findByIdAndUpdate(wishlist._id, wishlist);
    } else {
      const newWishlist = await Wishlist.create({
        user: user,
        wishlist: [product],
      });
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
