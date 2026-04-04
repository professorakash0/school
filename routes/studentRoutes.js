import express from "express";
import { getStudents, addStudent, deleteStudent, updateStudent, getOneStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, addStudent);

router.route('/:id')
  .get(protect, getOneStudent)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

export default router;