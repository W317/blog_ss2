import express from 'express';
import path from "path";
import { getAllUser } from '../app/controllers/AdminController.js';

const router = express.Router();
const __dirname = path.resolve()


// read all user
router.get('/', getAllUser);

export default router;