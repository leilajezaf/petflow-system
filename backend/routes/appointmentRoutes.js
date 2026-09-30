const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment } = require('../controllers/appointmentController');

// GET /api/pets -> Obtener todas las mascotas
router.get('/', getAppointments);

// POST /api/pets -> Crear una nueva mascota
router.post('/', createAppointment);

module.exports = router;