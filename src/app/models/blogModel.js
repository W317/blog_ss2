import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPost = new mongoose.Schema({
  author: {
      type: ObjectId,
      required: true
  },
  author: {
    type: String,
    require: true
  },
  title: {
      type: String,
      require: true
  },
  body: {
      type: String,
      required: true,
      unique: true
  },
  images: [{
      type: String,
      required: true
  }],
  href: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const BlogSchema = mongoose.model('BlogPost', BlogPost);
export default BlogSchema;