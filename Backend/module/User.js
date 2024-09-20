const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    minlength: 3, 
    maxlength: 50 
  }, 
  password: { 
    type: String, 
    required: true, 
  },
  center: { 
    type: Schema.Types.ObjectId, 
    ref: 'Center',
    required: function() {
      return this.role !== 'superAdmin'; // Center is required unless the user is a superAdmin
    }
  },
  role: {
    type: String,
    enum: ['superAdmin', 'centerAdmin', 'centerUser'],
    required: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Track who created the user
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Track who last updated the user
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Track who deleted the user (if using soft delete)
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
