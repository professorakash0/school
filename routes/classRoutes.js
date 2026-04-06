import express from "express";
import { getClasses, addClass, DeleteClass, } from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClasses)
  .post(protect, addClass);

router.route('/:id')
  .delete(protect, DeleteClass);

export default router;
