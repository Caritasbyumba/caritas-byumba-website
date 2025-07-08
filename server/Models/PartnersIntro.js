import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    title: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const PartnersIntro = mongoose.model('PartnersIntro', schema);
export default PartnersIntro;
