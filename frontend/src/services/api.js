import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Mascotas ---
export const fetchPets = () => API.get('/pets');
export const createPet = (petData) => API.post('/pets', petData);

// --- Turnos ---
export const fetchAppointments = () => API.get('/appointments');
export const createAppointment = (appointmentData) => API.post('/appointments', appointmentData);

export default API;