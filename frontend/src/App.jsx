import React, { useState } from 'react';
import PetForm from './components/PetForm';
import PetList from './components/PetList';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

function App() {
  const [refreshPets, setRefreshPets] = useState(0);
  const [refreshAppointments, setRefreshAppointments] = useState(0);

  // Se dispara al registrar una mascota para actualizar PetList y el select de AppointmentForm
  const handlePetAdded = () => {
    setRefreshPets((prev) => prev + 1);
  };

  // Se dispara al agendar un turno para actualizar la lista AppointmentList
  const handleAppointmentCreated = () => {
    setRefreshAppointments((prev) => prev + 1);
  };

  // Función para redirigir al usuario al link de pago de Mercado Pago
  const handlePayClick = async (appointment) => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: appointment._id })
      });

      const data = await response.json();

if (!response.ok) {
      throw new Error(data.message || 'Error en el servidor');
    }

      if (data.init_point) {
        // Redirige directamente al Checkout Pro de Mercado Pago
        window.location.href = data.init_point;
     } else {
      alert('No se pudo obtener el enlace de pago.');
    }
  } catch (error) {
    alert(`Error al generar cobro: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#111827', marginBottom: '24px' }}>
        Gestión de Pet Shop & Peluquería
      </h1>

      {/* Formularios principales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <PetForm onPetAdded={handlePetAdded} />
        <AppointmentForm onAppointmentCreated={handleAppointmentCreated} />
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />

      {/* Listados de información */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <PetList refreshTrigger={refreshPets} />
        <AppointmentList refreshTrigger={refreshAppointments} onPayClick={handlePayClick} />
      </div>
    </div>
  );
}

export default App;