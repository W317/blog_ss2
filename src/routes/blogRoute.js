import express from 'express';
import {getAllBlogs} from '../app/controllers/BlogController.js';
const router = express.Router();

// router.use('/blog);
router.use('/pages/blog', getAllBlogs);

export default router;
