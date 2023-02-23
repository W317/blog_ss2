import express from 'express';
import docController from '../app/controllers/DocController.js';
const router = express.Router();

router.use('/', docController.index);

export default router;
