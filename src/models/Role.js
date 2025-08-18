import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del rol es requerido'],
    unique: true,
    trim: true,
    enum: ['Admin', 'Project Manager', 'Developer', 'Viewer']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

roleSchema.index({ name: 1 });

export default mongoose.model('Role', roleSchema);

