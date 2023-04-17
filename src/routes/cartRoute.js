import express from "express";
const router = express.Router();
import { Cart } from "../app/models/cartModel.js";
import Product from "../app/models/productModel.js";
import Order from '../app/models/orderModel.js'
import path from 'path'
import * as stripe from "stripe"
import asyncHandler from 'express-async-handler'
import userModel from "../app/models/userModel.js";
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

router.get('/checkout', isLoggedIn, (req, res, next) => {
  console.log('processing the get checkout...');

  if (!req.session.cart) {
    return res.redirect('/shop');
  }

  console.log('req.session.cart: ', req.session.cart);

  let cart = new Cart(req.session.cart);
  let errMsg = req.flash('error')[0];
  // res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg})
  res.render(path.join(__dirname + "/src/views/checkout.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    total: (cart.totalPrice * 100).toFixed(2),
    errMsg: errMsg,
    noErrors: !errMsg
  });
})

router.post('/checkout', isLoggedIn, (req, res, next) => {

  if (!req.session.cart) {
      return res.redirect('/shop');
  }
  let cart = new Cart(req.session.cart);
  /*
  var stripe = require("stripe")(
      "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
  );
  */
  const stripeApp = stripe.Stripe(
    "sk_test_l6yzGVoH7wUkz5F7vRrRlczU"
  )
  const total = cart?.totalPrice * 100
  stripeApp.charges.create({
      amount: total,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Pay With Stripe"
  }, (err, charge) => {
      if (err) {
          console.log('there were errors...');
          req.flash('error', err.message);
          return res.redirect('/checkout');
      }
      console.log("=============================================");
      console.log('req.user: ', req.user);
      console.log('cart: ', cart);
      console.log('address: ', req.body.address);
      console.log('name: ', req.body.name);
      console.log('paymentId: ', charge.id);

      const order = new Order({
          user: req.user,
          cart: cart,
          phone: req.body.phone,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id,
          status: "PENDING"
      });

      order.save(function(err, result) {
          if (err) {
           console.log(err);
           throw err;
          }
          console.log(result);
          req.flash('success', 'Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
      });

  }); 
});

export function isLoggedIn(req, res, next) {
  // console.log(req);
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}


export const isAdmin = asyncHandler(async (req, res, next) => {
  if(!req.isAuthenticated()) {
    res.redirect('/user/signin');
  }

  let user;
  if(req.session.passport.user) {
    user = await userModel.findById(req.session.passport.user)
  }
  // console.log('user', user);
  if(user && user?.isAdmin) {
    return next()
  }

  res.redirect('/');
})

export default router