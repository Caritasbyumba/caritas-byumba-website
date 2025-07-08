import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    isActive: { type: Boolean, default: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const DonationArea = mongoose.model('DonationArea', schema);
export default DonationArea;
