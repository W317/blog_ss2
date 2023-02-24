import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPost = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  image: String,
  date: Date
});

const BlogSchema = mongoose.model('BlogPost', BlogPost);
export default BlogSchema;