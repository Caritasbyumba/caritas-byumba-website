import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    vision: { en: String, fr: String, rw: String },
    mission: { en: String, fr: String, rw: String },
    objectives: { en: String, fr: String, rw: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Aboutus = mongoose.model('Aboutus', schema);
export default Aboutus;
