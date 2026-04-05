import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // allow all (for now)
  credentials: true
}));
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// Routes (to be added)
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('School Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
