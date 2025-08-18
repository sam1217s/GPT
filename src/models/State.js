import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del estado es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  type: {
    type: String,
    required: [true, 'El tipo de estado es requerido'],
    enum: ['Project', 'Task']
  },
  order: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

stateSchema.index({ type: 1, order: 1 });
stateSchema.index({ name: 1, type: 1 }, { unique: true });

export default mongoose.model('State', stateSchema);

