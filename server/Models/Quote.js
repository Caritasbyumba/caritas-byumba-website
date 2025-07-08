import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    role: { en: String, fr: String, rw: String },
    profile: String,
    quote: { en: String, fr: String, rw: String },
    order: { type: Number, default: 1000 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Quote = mongoose.model('Quote', schema);
export default Quote;
