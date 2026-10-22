import mongoose from 'mongoose';

// One document per page: key 'home' for the homepage, or a hostel key (e.g. 'BH-1').
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: String },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model('Content', contentSchema);
