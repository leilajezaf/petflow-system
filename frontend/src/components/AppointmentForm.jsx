import React, { useState, useEffect } from 'react';

// Tarifador base por tipo de pelaje (Duración base en min / Precio base en $ ARS)
const COAT_PRICING = {
  corto_raso: { duration: 45, basePrice: 12000 },
  corto_doble_desmuda: { duration: 60, basePrice: 15000 },
  manto_doble_medio: { duration: 75, basePrice: 18000 },
  manto_doble_largo: { duration: 90, basePrice: 22000 },
  manto_nordico_denso: { duration: 105, basePrice: 25000 },
  pelo_largo_lacio: { duration: 75, basePrice: 18000 },
  pelo_mota_rizado: { duration: 90, basePrice: 20000 },
  pelo_duro_alambre: { duration: 90, basePrice: 24000 },
  pelo_encordado: { duration: 120, basePrice: 30000 },
  sin_pelo: { duration: 30, basePrice: 10000 },
  anudado_fieltrado: { duration: 120, basePrice: 28000 },

  // Fallbacks para datos antiguos (Legacy)
  SHORT: { duration: 45, basePrice: 12000 },
  MEDIUM: { duration: 60, basePrice: 15000 },
  LONG: { duration: 90, basePrice: 20000 },
  MATTED_MUDANDO: { duration: 120, basePrice: 28000 }
};

// Ajuste según el tipo de servicio seleccionado
const SERVICE_MODIFIERS = {
  'Baño y Corte': { priceMultiplier: 1.0, durationModifier: 0 },
  'Solo Baño / Desmuda': { priceMultiplier: 0.8, durationModifier: -15 },
  'Corte de Uñas / Higiénico': { fixedPrice: 8000, fixedDuration: 30 },
  'Stripping': { priceMultiplier: 1.3, durationModifier: 30 }
};

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    serviceType: 'Baño y Corte',
    calculatedDurationMinutes: 60,
    totalPrice: 15000,
    depositAmount: 4500
  });

  const [message, setMessage] = useState('');

  // 1. Cargar mascotas registradas desde la API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pets');
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        }
      } catch (error) {
        console.error('Error al cargar mascotas para la agenda:', error);
      }
    };
    fetchPets();
  }, []);

  // Función central para recalcular el precio y tiempo según mascota y servicio
  const calculatePricing = (petId, serviceType) => {
    const selectedPet = pets.find((p) => p._id === petId);
    const serviceInfo = SERVICE_MODIFIERS[serviceType] || SERVICE_MODIFIERS['Baño y Corte'];

    if (!selectedPet) return;

    // Si es un servicio rápido como uñas/higiénico con tarifa fija
    if (serviceInfo.fixedPrice) {
      const price = serviceInfo.fixedPrice;
      const duration = serviceInfo.fixedDuration;
      const deposit = Math.round(price * 0.3);

      setFormData((prev) => ({
        ...prev,
        calculatedDurationMinutes: duration,
        totalPrice: price,
        depositAmount: deposit
      }));
      return;
    }

    // Cálculo dinámico por pelaje + peso + servicio
    const coatInfo = COAT_PRICING[selectedPet.coatType] || { duration: 60, basePrice: 15000 };
    const weight = Number(selectedPet.weightKg) || 0;
    const weightExtra = weight > 5 ? Math.round((weight - 5) * 500) : 0;

    const basePriceTotal = coatInfo.basePrice + weightExtra;
    const finalPrice = Math.round(basePriceTotal * serviceInfo.priceMultiplier);
    
    const calculatedDuration = Math.max(20, coatInfo.duration + serviceInfo.durationModifier);
    const deposit = Math.round(finalPrice * 0.3); // Seña del 30%

    setFormData((prev) => ({
      ...prev,
      calculatedDurationMinutes: calculatedDuration,
      totalPrice: finalPrice,
      depositAmount: deposit
    }));
  };

  // Cambio de Mascota
  const handlePetChange = (e) => {
    const petId = e.target.value;
    setSelectedPetId(petId);
    calculatePricing(petId, formData.serviceType);
  };

  // Cambio de Servicio (Recalcula automáticamente)
  const handleServiceChange = (e) => {
    const serviceType = e.target.value;
    setFormData((prev) => ({ ...prev, serviceType }));
    calculatePricing(selectedPetId, serviceType);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedPetId) {
      setMessage('Por favor, selecciona una mascota registrada.');
      return;
    }

    const combinedDate = new Date(`${formData.date}T${formData.time}:00`);

    const bodyToSend = {
      pet: selectedPetId,
      serviceType: formData.serviceType,
      appointmentDate: combinedDate,
      calculatedDurationMinutes: Number(formData.calculatedDurationMinutes),
      totalPrice: Number(formData.totalPrice),
      depositAmount: Number(formData.depositAmount),
      status: 'PENDING_DEPOSIT'
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Turno agendado con éxito!');
        setSelectedPetId('');
        setFormData({
          date: '',
          time: '',
          serviceType: 'Baño y Corte',
          calculatedDurationMinutes: 60,
          totalPrice: 15000,
          depositAmount: 4500
        });

        if (onAppointmentCreated) {
          onAppointmentCreated(data);
        }
      } else {
        setMessage(`Error: ${data.message || JSON.stringify(data)}`);
      }
    } catch (error) {
      setMessage('Error de conexión al agendar el turno.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {message && <p style={msgStyle}>{message}</p>}

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Mascota:
          <select
            value={selectedPetId}
            onChange={handlePetChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccionar mascota...</option>
            {pets.map((pet) => (
              <option key={pet._id} value={pet._id}>
                {pet.petName} ({pet.ownerName || 'Sin dueño'})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Fecha:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Hora:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Servicio:
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleServiceChange}
            style={inputStyle}
          >
            <option value="Baño y Corte">Baño y Corte completo</option>
            <option value="Solo Baño / Desmuda">Solo Baño y Desmuda</option>
            <option value="Corte de Uñas / Higiénico">Corte Higiénico y Uñas</option>
            <option value="Stripping">Hand Stripping (Pelo Duro)</option>
          </select>
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Duración estimada (minutos):
          <input
            type="number"
            name="calculatedDurationMinutes"
            value={formData.calculatedDurationMinutes}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Precio Total ($):
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Monto de Seña ($):
          <input
            type="number"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>

      <button type="submit" style={buttonStyle}>
        Agendar Turno
      </button>
    </form>
  );
};

// Estilos en JS
const formStyle = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  maxWidth: '480px',
  margin: '0 auto'
};

const fieldStyle = {
  marginBottom: '12px'
};

const labelStyle = {
  display: 'block',
  fontWeight: '500',
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  marginTop: '4px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '12px 16px',
  marginTop: '12px',
  backgroundColor: '#0284c7',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem'
};

const msgStyle = {
  padding: '10px',
  backgroundColor: '#dcfce7',
  color: '#15803d',
  borderRadius: '4px',
  marginBottom: '16px',
  textAlign: 'center',
  fontWeight: '600'
};

export default AppointmentForm;