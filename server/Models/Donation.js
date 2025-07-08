import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: String,
    email: String,
    transactionReference: String,
    amount: String,
    currency: String,
    donationArea: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationArea' },
  },
  { timestamps: true }
);
const Donation = mongoose.model('Donation', schema);
export default Donation;
