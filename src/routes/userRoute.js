import express from 'express';
import userController from '../app/controllers/UserController.js';
const router = express.Router();

router.use('/user', userController.user);

export default router;