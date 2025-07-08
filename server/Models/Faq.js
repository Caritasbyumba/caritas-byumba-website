import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    question: { en: String, fr: String, rw: String },
    answer: { en: String, fr: String, rw: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Faq = mongoose.model('Faq', schema);
export default Faq;
