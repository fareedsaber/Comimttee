const user = mongoose.model('User', UserSchema);
  
  const ClinicsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    yaseer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    }]
  });
  
  const Clinics = mongoose.model('Clinics', ClinicsSchema);
  