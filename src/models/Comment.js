import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'El contenido del comentario es requerido'],
    trim: true,
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es requerido']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'El proyecto es requerido']
  },
  editedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indices
commentSchema.index({ projectId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Virtual para verificar si fue editado
commentSchema.virtual('isEdited').get(function() {
  return this.editedAt !== null;
});

commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Comment', commentSchema);