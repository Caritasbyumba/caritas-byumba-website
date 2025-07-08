import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    description: { en: String, fr: String, rw: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const DonationMessage = mongoose.model('DonationMessage', schema);
export default DonationMessage;
