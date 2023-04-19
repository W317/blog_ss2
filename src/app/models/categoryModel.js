import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const Category = new Schema({
  title: {type: String, required: true},
  query: {type: String, required: true}
}, {
  timestamps: true
})

const CategoryModel = mongoose.model('Category', Category);
export default CategoryModel;