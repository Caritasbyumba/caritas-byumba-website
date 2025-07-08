import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    role: { type: String, default: 'content creator' },
  },
  { timestamps: true }
);

// Only create the model if it doesn't already exist
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;