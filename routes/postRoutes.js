import express from "express";
import { getPosts, createPost, deletePost, getOnePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), createPost);

router.route('/:id')
  .get(getOnePost)
  .delete(protect, deletePost);

export default router;
