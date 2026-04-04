import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  salaryStatus: {
    type: String,
    enum: ['paid', 'not paid'],
    default: 'not paid'
  },
  salaryPaidDate: {
    type: Date,
    default: null,
  },
  classIncharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
