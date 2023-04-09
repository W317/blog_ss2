import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const BlogPost = new Schema({
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
  image: {
      type: String,
      required: false
  },
  href: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const BlogSchema = mongoose.model('BlogPost', BlogPost);
export default BlogSchema;