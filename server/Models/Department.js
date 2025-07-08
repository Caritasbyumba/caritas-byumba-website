import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    smallDescription: { en: String, fr: String, rw: String },
    image: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Department = mongoose.model('Department', schema);
export default Department;
