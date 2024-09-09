const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    center: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Center', 
      required: true 
    },
    Clinics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinics'
    }]
  });
  
  