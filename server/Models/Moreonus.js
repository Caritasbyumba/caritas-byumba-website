import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    description: { en: String, fr: String, rw: String },
    callToActionBtn: { en: String, fr: String, rw: String },
    callToActionLink: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Moreonus = mongoose.model('Moreonus', schema);
export default Moreonus;
