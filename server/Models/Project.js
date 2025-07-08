import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    smallDescription: { en: String, fr: String, rw: String },
    description: { en: String, fr: String, rw: String },
    startDate: Date,
    endDate: Date,
    gallery: [String],
    imageDescriptions: [
      { name: String, description: { en: String, fr: String, rw: String } },
    ],
    isMain: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Project = mongoose.model('Project', schema);
export default Project;
