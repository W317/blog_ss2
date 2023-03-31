import express from "express";
const router = express.Router();
import { Cart } from "../app/models/cartModel.js";
import Product from "../app/models/productModel.js";
import path from 'path'
const __dirname = path.resolve()

router.get("/add-to-cart/:id", (req, res, next) => {
  // we want to have a cart object in the session!
  let productId = req.params.id;
  // var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect("/"); // we probably need a better redirect in a real app
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    // console.log(req.session.cart);
    res.redirect("/cart/shopping-cart");
  });
});

router.get("/reduce/:id", (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/cart/shopping-cart");
});

router.get("/remove/:id", (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/cart/shopping-cart");
});

router.get("/shopping-cart", (req, res, next) => {
  if (!req.session.cart) {
    return res.render(path.join(__dirname + "/src/views/cart.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      products: null,
      totalPrice: 0,
    });
  }
  let cart = new Cart(req.session.cart);
  let cartArr = []
  cartArr = Object.keys(req?.session?.cart?.items).map((item) => req?.session?.cart?.items[item])
  res.render(path.join(__dirname + "/src/views/cart.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    products: cartArr,
    totalPrice: cart.totalPrice,
  });
});

export default router