"use strict";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema({
  quantity: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
<<<<<<< HEAD
}, {
  timestamps: true
});
=======
}, {timestamps: true});
>>>>>>> 01a42aec0c3e651e3feb419542d188b1f5089945

const Product = mongoose.model("Product", schema);
export default Product;
