import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    smallDescription: { en: String, fr: String, rw: String },
    challenges: { en: String, fr: String, rw: String },
    image: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Service = mongoose.model('Service', schema);
export default Service;
