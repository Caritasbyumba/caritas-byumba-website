import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    email: String,
    body: String,
    replied: { type: Boolean, default: false },
    reply: String,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
const Message = mongoose.model('Message', schema);
export default Message;
