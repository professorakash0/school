import Class from '../models/Class.js';
import Teacher from '../models/Teacher.js';

// Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}).populate("classIncharge", "className").sort({ createdAt: -1 });
    if (!teachers.length) {
      return res.status(200).json({
        message: "No teachers found",
        data: []
      });
    }
    res.status(200).json({
      teachers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// geting one teacher 
export const getOneTeacher = async (req, res) => {
  const {id} = req.params
  try {
    const teacher = await Teacher.findById(id).populate("classIncharge", "className")
    if (!teacher) {
      return res.status(400).json({
        message:"Teacher not found"
      })
    }
    res.status(200).json({
      teacher
    })
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
}

// Add new teacher
export const addTeacher = async (req, res) => {
  let { name, email, salaryStatus, classIncharge } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and Email are required"
    });
  }

  try {

    let salaryPaidDate = null
    if (salaryStatus === "paid") {
      salaryPaidDate = new Date();
    } else {
      salaryStatus = "not paid"
    }

    // ✅ Fix empty string
    if (!classIncharge) {
      classIncharge = null;
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher already exist"
      });
    }

    // ✅ Only check if class exists
    if (classIncharge) {
      const classAlreadyAssigned = await Teacher.findOne({ classIncharge });

      if (classAlreadyAssigned) {
        return res.status(400).json({
          message: "This class already has a teacher assigned"
        });
      }

      const existingClass = await Class.findById(classIncharge);

      if (!existingClass) {
        return res.status(404).json({
          message: "Class not found"
        });
      }
    }

    const teacher = await Teacher.create({
      name,
      email,
      salaryStatus: salaryStatus || "not paid",
      classIncharge,
      salaryPaidDate
    });

    res.status(201).json(teacher);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// update Teacher 
export const updateTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    let { name, email, salaryStatus, classIncharge } = req.body;

    let salaryPaidDate = null
    if (salaryStatus === "paid") {
      salaryPaidDate = new Date();
    } else {
      salaryPaidDate = null;
    }

    // ✅ Required validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and Email are required",
      });
    }

    // ✅ Handle empty class
    if (!classIncharge) {
      classIncharge = null;
    }

    // ✅ Check if teacher exists
    const existingTeacher = await Teacher.findById(id);
    if (!existingTeacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // ✅ Check email uniqueness (exclude current teacher)
    const emailExists = await Teacher.findOne({
      email,
      _id: { $ne: id },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    // ✅ If class is provided → validate it
    if (classIncharge) {
      const existingClass = await Class.findById(classIncharge);
      if (!existingClass) {
        return res.status(404).json({
          message: "Class not found",
        });
      }

      // ✅ Ensure one class = one teacher
      const classAssigned = await Teacher.findOne({
        classIncharge,
        _id: { $ne: id },
      });

      if (classAssigned) {
        return res.status(400).json({
          message: "This class already has a teacher assigned",
        });
      }
    }

    // ✅ Update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        name,
        email,
        salaryStatus: salaryStatus || "not paid",
        classIncharge,
        salaryPaidDate
      },
      { new: true }
    );

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      message: "Id is required"
    })
  }
  try {
    await Teacher.updateMany(
      { classIncharge: id },
      { $set: { classIncharge: null } }
    );
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({
      message: "Teacher deleted successfully",
      deletedTeacher: teacher
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
