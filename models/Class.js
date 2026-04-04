import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    lowercase:true,
    unique:true
  },
   monthlyFee: {
    type: Number,
    required:true
  },
}, { timestamps: true });

export default mongoose.model('Class', classSchema);
