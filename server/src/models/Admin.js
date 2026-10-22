import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // 'main' or a hostel key
    loginId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
