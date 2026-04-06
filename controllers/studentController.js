import Class from '../models/Class.js';
import Student from '../models/Student.js';

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("fullName fatherName feeStatus feePaidDate class")
      .populate("class", "className")
      .lean();

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get one student 
export const getOneStudent = async (req, res) => {
  const {id} = req.params
  try {
    const student = await Student.findById(id)
    .populate("class", "className")
    .lean();

    if (!student) {
      return res.status(400).json({
        message:"Student not found"
      })
    }
    res.status(200).json({
      student
    })
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
}

// Add new student
export const addStudent = async (req, res) => {
  let { fullName, fatherName, class: classId, feeStatus } = req.body;
  if (!fullName || !fatherName || !classId) {
    return res.status(400).json({
      message: "Full name, father name and class are required"
    });
  }
  try {

    let feePaidDate = null
    if (feeStatus === "paid") {
      feePaidDate = new Date();
    } else {
      feeStatus = "not paid"
    }

    const existingClass = await Class.findById(classId).lean();
    if (!existingClass) {
      return res.status(404).json({
        message: "Class not found"
      });
    }
    const student = await Student.create({
      fullName,
      fatherName,
      class: classId,
      feeStatus: feeStatus || "not paid",
      feePaidDate
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update student 
export const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    let { fullName, fatherName, class: classId, feeStatus } = req.body;

    let feePaidDate = null
    if (feeStatus === "paid") {
      feePaidDate = new Date();
    } else {
      feeStatus = null;
    }

    // Validate required fields
    if (!fullName || !fatherName) {
      return res.status(400).json({
        message: "Full name and father name are required",
      });
    }

    // Handle class
    if (!classId) {
      classId = null;
    } else {
      const existingClass = await Class.findById(classId).lean();
      if (!existingClass) {
        return res.status(404).json({
          message: "Class not found",
        });
      }
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        fullName,
        fatherName,
        class: classId,
        feeStatus: feeStatus || "not paid",
        feePaidDate
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 check valid MongoDB ID
    if (!id) {
      return res.status(400).json({
        message: "Student ID is required"
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      deletedStudent: student
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
