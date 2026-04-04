import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({});

    const result = await Promise.all(
      classes.map(async (cls) => {
        // 🔢 Count students
        const studentCount = await Student.countDocuments({
          class: cls._id,
        });

        // 👩‍🏫 Find teacher
        const teacher = await Teacher.findOne({
          classIncharge: cls._id,
        });

        return {
          ...cls.toObject(),
          studentCount,
          classIncharge: teacher ? teacher.name : "Not Assigned",
        };
      })
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new class
export const addClass = async (req, res) => {
  const { className, monthlyFee } = req.body;
  if (!className || !monthlyFee) {
    return res.status(400).json({
      message: "Class name and monthly fee is required"
    })
  }
  try {
    const existClass = await Class.findOne({ className })
    if (existClass) {
      return res.status(400).json({
        message: "Class already exist"
      })
    }
    const newClass = await Class.create({ className, monthlyFee });
    res.status(201).json(newClass, monthlyFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deleting class
export const DeleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findOne({ classIncharge: id });
    if (teacher) {
      return res.status(400).json({
        message: "Cannot delete class. A teacher is assigned to it."
      });
    }

    const updatedClass = await Class.findByIdAndDelete(id);
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({
      message: "class removed"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
