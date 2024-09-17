const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, // Trims whitespace from name
    minlength: 3, // Minimum length for center name
    maxlength: 100, // Maximum length for center name
  },
  location: { 
    type: String, 
    required: true, 
    trim: true, // Trims whitespace
    minlength: 3, // Minimum length for location
    maxlength: 500, // Maximum length for URL
    validate: {
      validator: function(v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Regular expression to validate URLs
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  location: { type: String, required: true },
  dateOfBuild: { type: Date, required: true },
  dateOfContract: { type: Date, required: true },
  logo: { type: String },
  
  users: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }] // Array of users associated with this center
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export the Center model
module.exports = mongoose.model('Center', CenterSchema);
