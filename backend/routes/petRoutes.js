const express = require('express');
const router = express.Router();
const { getPets, createPet } = require('../controllers/petController');

// GET /api/pets -> Obtener todas las mascotas
router.get('/', getPets);

// POST /api/pets -> Crear una nueva mascota
router.post('/', createPet);

module.exports = router;