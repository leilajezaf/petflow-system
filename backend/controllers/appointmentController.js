const Appointment = require('../models/Appointment');

// Obtener todos los turnos
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('pet');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los turnos', error: error.message });
  }
};

// Crear un turno
const createAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el turno', error: error.message });
  }
};

module.exports = { getAppointments, createAppointment };