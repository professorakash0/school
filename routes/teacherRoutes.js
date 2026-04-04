import express from "express";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, getOneTeacher } from '../controllers/teacherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTeachers)
  .post(protect, addTeacher);

router.route('/:id')
  .get(protect, getOneTeacher)
  .put(protect, updateTeacher)
  .delete(protect, deleteTeacher);

export default router;
