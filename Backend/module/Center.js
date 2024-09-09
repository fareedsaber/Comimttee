const centerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    User: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  });
  
  const Center = mongoose.model('Center', centerSchema);
  