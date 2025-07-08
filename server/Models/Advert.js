import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    gallery: [String],
    imageDescriptions: [
      { name: String, description: { en: String, fr: String, rw: String } },
    ],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Advert = mongoose.model('Advert', schema);
export default Advert;
