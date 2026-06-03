import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    color: { type: String, default: '#7c3aed' },
    icon: { type: String, default: '🎮' }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
