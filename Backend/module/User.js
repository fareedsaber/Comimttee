const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
      return this.role !== 'superAdmin'; // Center is required unless role is superAdmin
    }
  },
  role: {
    type: String,
    enum: ['superAdmin', 'centerAdmin', 'centerUser'],
    required: true
  }
  
  
}, {
  timestamps: true
});



module.exports = mongoose.model('User', userSchema);
