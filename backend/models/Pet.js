const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  petName: { type: String, required: true },
  species: { type: String, enum: ['DOG', 'CAT'], required: true },
  breed: { type: String, default: 'Mestizo' },
  weightKg: { type: Number, required: true },
  coatType: { 
    type: String, 
    enum: ['SHORT', 'MEDIUM', 'LONG', 'MATTED_MUDANDO'], 
    default: 'SHORT' 
  },
  healthConditions: {
    hasJointPain: { type: Boolean, default: false },
    isGeriatric: { type: Boolean, default: false },
    hasSkinIssues: { type: Boolean, default: false }
  },
  behaviorNotes: {
    reactivityLevel: { 
      type: String, 
      enum: ['CALM', 'MODERATE', 'HIGH_STRESS'], 
      default: 'CALM' 
    },
    dryerPhobia: { type: Boolean, default: false },
    handlingNotes: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);