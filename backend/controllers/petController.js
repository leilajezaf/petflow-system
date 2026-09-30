const Pet = require('../models/Pet');

// Obtener todas las mascotas
const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las mascotas', error: error.message });
  }
};

// Crear una mascota
const createPet = async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la mascota', error: error.message });
  }
};

module.exports = { getPets, createPet };