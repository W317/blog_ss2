"use strict";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  wishlist: {type: [Object], require: true}
});


const Wishlist = mongoose.model("Wishlist", schema);
export default Wishlist;