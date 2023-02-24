import express from 'express';
import {getAllBlogs} from '../app/controllers/SiteController.js';
const router = express.Router();

// router.use('/search', siteController.search);
router.use('/', getAllBlogs);

export default router;
