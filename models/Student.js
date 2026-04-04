import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  },
  feeStatus: {
    type: String,
    enum: ['paid', 'not paid'],
    default: 'not paid'
  },
  feePaidDate: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
