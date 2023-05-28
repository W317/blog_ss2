import express from 'express';
import userModel from '../app/models/userModel.js';
import  { getOneUser, updateUser, getEditUser } from '../app/controllers/UserController.js';
import upload from '../app/middleware/uploadFile.js';
import asyncHandler from 'express-async-handler';
import path from "path";
import { isLoggedIn } from './cartRoute.js';
const router = express.Router();
const __dirname = path.resolve();


router.get("/profile", isLoggedIn, getOneUser);

// update a product by id
router.put('/profile/update/:id', upload, updateUser);

router.get('/profile/edit/:id', getEditUser);

export default router;