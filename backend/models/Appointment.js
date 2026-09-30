const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  serviceType: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  calculatedDurationMinutes: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING_DEPOSIT', 'CONFIRMED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING_DEPOSIT' 
  },
  mpPreferenceId: { type: String },
  paymentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);