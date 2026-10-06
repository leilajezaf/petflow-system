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
    enum: ['corto_raso',
      'corto_doble_desmuda',
      'manto_doble_medio',
      'manto_doble_largo',
      'manto_nordico_denso',
      'pelo_largo_lacio',
      'pelo_mota_rizado',
      'pelo_duro_alambre',
      'pelo_encordado',
      'sin_pelo',
      'anudado_fieltrado'], 
    default: 'corto_raso' 
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