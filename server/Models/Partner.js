import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    description: { en: String, fr: String, rw: String },
    quote: { en: String, fr: String, rw: String },
    image: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Partner = mongoose.model('Partner', schema);
export default Partner;
