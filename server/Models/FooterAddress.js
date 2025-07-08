import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: { en: String, fr: String, rw: String },
    value: String,
    type: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const FooterAddress = mongoose.model('FooterAddress', schema);
export default FooterAddress;
