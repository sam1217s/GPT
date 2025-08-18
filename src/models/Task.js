import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'El proyecto es requerido']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador es requerido']
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: [true, 'El estado es requerido']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  estimatedHours: {
    type: Number,
    default: 0,
    min: [0, 'Las horas estimadas no pueden ser negativas']
  },
  actualHours: {
    type: Number,
    default: 0,
    min: [0, 'Las horas actuales no pueden ser negativas']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.startDate;
      },
      message: 'La fecha de vencimiento debe ser posterior a la fecha de inicio'
    }
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada tag no puede exceder 50 caracteres']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indices
taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ isActive: 1 });

// Virtual para verificar si está vencida
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && !this.completedAt;
});

// Virtual para calcular progreso
taskSchema.virtual('progress').get(function() {
  if (this.estimatedHours === 0) return 0;
  return Math.min(100, (this.actualHours / this.estimatedHours) * 100);
});

taskSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Task', taskSchema);

