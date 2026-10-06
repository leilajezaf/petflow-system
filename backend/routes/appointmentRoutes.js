// backend/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Inicializar cliente Mercado Pago con el ACCESS_TOKEN del .env
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || ''
});

// GET: Obtener todos los turnos
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('pet')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crear turno
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST: Crear preferencia de cobro en Mercado Pago
router.post('/create-preference', async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Se requiere appointmentId' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    // Convertir y validar el monto de la seña
    const depositAmount = Number(appointment.depositAmount);
   if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: 'El valor de la seña es inválido' });
    }

    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          id: appointment._id.toString(),
          title: `Seña Turno Peluquería`,
          quantity: 1,
          unit_price: depositAmount,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: 'http://localhost:5173',
        failure: 'http://localhost:5173',
        pending: 'http://localhost:5173'
      },
      auto_return: 'approved',
    };

    const response = await preference.create({ body: preferenceData });

    // Guardar el preferenceId en el documento del turno
    appointment.mpPreferenceId = response.id;
    await appointment.save();

    res.json({ init_point: response.init_point });
  } catch (error) {
    // Imprime el motivo exacto en la terminal del backend
    console.error('=== ERROR AL CREAR PREFERENCIA EN MERCADO PAGO ===');
    console.error(error);

    res.status(500).json({
      message: 'Error al procesar el pago con Mercado Pago',
      error: error.message
    });
  }
});

module.exports = router;