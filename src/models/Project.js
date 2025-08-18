import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proyecto es requerido'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario es requerido']
  },
  members: [projectMemberSchema],
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
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es requerida'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
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
  budget: {
    type: Number,
    default: 0,
    min: [0, 'El presupuesto no puede ser negativo']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada tag no puede exceder 50 caracteres']
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Indices
projectSchema.index({ owner: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ startDate: 1, endDate: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ isActive: 1 });

// Virtual para calcular progreso
projectSchema.virtual('progress').get(function() {
  if (this.estimatedHours === 0) return 0;
  return Math.min(100, (this.actualHours / this.estimatedHours) * 100);
});

// Método para verificar si un usuario es miembro
projectSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString()) 
    || this.owner.toString() === userId.toString();
};

// Método para obtener rol de usuario en el proyecto
projectSchema.methods.getUserRole = function(userId) {
  if (this.owner.toString() === userId.toString()) return 'Owner';
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member ? member.role : null;
};

projectSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Project', projectSchema);

