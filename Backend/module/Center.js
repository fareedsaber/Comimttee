const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3, 
    maxlength: 100 
  },
  location: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3, 
    maxlength: 500, 
    validate: {
      validator: function(v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v); 
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  dateOfBuild: { type: Date, required: true },
  dateOfContract: { type: Date, required: true },
  logo: { type: String },

  users: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Track who created the center
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Track who last updated the center
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Track who deleted the center (if using soft delete)
  },

  // Track when users are added and by whom
  userAdditions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    addedAt: { type: Date, default: Date.now }
  }]

}, {
  timestamps: true
});

// Middleware to update 'updatedBy' before saving
CenterSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Center', CenterSchema);
