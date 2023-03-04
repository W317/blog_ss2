import express from 'express';
import {getAllBlogs} from '../app/controllers/BlogController.js';
const router = express.Router();

// router.use('/blog);
router.get('/', getAllBlogs);
// router.post('/pages/blog/create', createBlog)

export default router;
