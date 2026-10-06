import React, { useState } from 'react';

// Diccionario de razas por especie
const BREEDS_BY_SPECIES = {
  DOG: [
    'Mestizo / Criollo / Mezcla',
    'Caniche / Poodle',
    'Labrador Retriever',
    'Golden Retriever',
    'Bulldog Francés',
    'Bulldog Inglés',
    'Ovejero Alemán',
    'Yorkshire Terrier',
    'Dachshund / Salchicha',
    'Boxer',
    'Beagle',
    'Shih Tzu',
    'Pug / Carlino',
    'Mestizo / Criollo',
    'Otra raza'
  ],
  CAT: [
    'Mestizo / Común Europeo / Mezcla',
    'Mestizo / Común Europeo',
    'Siamés',
    'Persa',
    'Maine Coon',
    'Bengalí',
    'Ragdoll',
    'Sphynx / Esfinge',
    'British Shorthair',
    'Angora',
    'Otra raza'
  ]
};

// Listado profesional de tipos de pelaje para peluquería
export const COAT_TYPES = [
 { value: 'corto_raso', label: 'Pelo Corto / Raso' },
  { value: 'corto_doble_desmuda', label: 'Pelo Corto Doble / Con Subpelo Pug' },
  { value: 'manto_doble_medio', label: 'Manto Doble Medio' },
  { value: 'manto_doble_largo', label: 'Manto Doble Largo' },
  { value: 'manto_nordico_denso', label: 'Manto Nórdico / Denso' },
  { value: 'pelo_largo_lacio', label: 'Pelo Largo Lacio / Sedoso' },
  { value: 'pelo_mota_rizado', label: 'Pelo Rizado / Mota / Lana' },
  { value: 'pelo_duro_alambre', label: 'Pelo Duro / Alambre' },
  { value: 'pelo_encordado', label: 'Pelo Encordado / Rastas' },
  { value: 'sin_pelo', label: 'Sin Pelo / Raza Desnuda' },
  { value: 'anudado_fieltrado', label: 'Anudado / Fieltrado / Muda Severa' }
];

const PetForm = ({ onPetAdded }) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: 'DOG',
    breed: BREEDS_BY_SPECIES.DOG[0],
    customBreed: '',
    weightKg: '',
    coatType: COAT_TYPES[0].value,
    ownerName: '',
    ownerPhone: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Si cambia la especie, actualizamos las razas correspondientes
      if (name === 'species') {
        return {
          ...prev,
          species: value,
          breed: BREEDS_BY_SPECIES[value][0],
          customBreed: ''
        };
      }

      return {
        ...prev,
        [name]: name === 'weightKg' ? (value === '' ? '' : Number(value)) : value
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Si seleccionó "Otra raza", enviamos el valor ingresado manualmente
    const finalBreed = formData.breed === 'Otra raza' ? formData.customBreed : formData.breed;
// Normalizar el peso: reemplaza comas por puntos antes de convertir a número
    const rawWeight = formData.weightKg.toString().replace(',', '.');
    const parsedWeight = parseFloat(rawWeight);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setMessage('Por favor, ingresa un peso válido.');
      return;
    }

    const bodyToSend = {
      petName: formData.petName,
      species: formData.species,
      breed: finalBreed,
      weightKg: Number(formData.weightKg),
      coatType: formData.coatType,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone
    };

    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Mascota registrada con éxito!');
        setFormData({
          petName: '',
          species: 'DOG',
          breed: BREEDS_BY_SPECIES.DOG[0],
          customBreed: '',
          weightKg: '',
          coatType: 'SHORT',
          ownerName: '',
          ownerPhone: ''
        });

        if (onPetAdded) {
          onPetAdded(data);
        }
      } else {
        setMessage(`Error: ${data.message || JSON.stringify(data)}`);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {message && <p style={msgStyle}>{message}</p>}

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Nombre de la Mascota:
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Ej: Lola"
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Especie:
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="DOG">Perro</option>
            <option value="CAT">Gato</option>
          </select>
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Raza:
          <select
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            {BREEDS_BY_SPECIES[formData.species].map((breedName) => (
              <option key={breedName} value={breedName}>
                {breedName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {formData.breed === 'Otra raza' && (
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Especificar Raza:
            <input
              type="text"
              name="customBreed"
              value={formData.customBreed}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Escribe la raza..."
            />
          </label>
        </div>
      )}

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Peso (en kg):
          <input
            type="number"
            step="0.1"
            name="weightKg"
            value={formData.weightKg}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Ej: 8.5"
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Tipo de Pelaje:
          <select
            name="coatType"
            value={formData.coatType}
            onChange={handleChange}
            style={inputStyle}
         >
      {COAT_TYPES.map((coat) => (
        <option key={coat.value} value={coat.value}>
          {coat.label}
        </option>
      ))}
          </select>
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Nombre del Dueño/a:
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: María Pérez"
          />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Teléfono de Contacto:
          <input
            type="tel"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Ej: 1112345678"
          />
        </label>
      </div>

      <button type="submit" style={buttonStyle}>
        Registrar Mascota
      </button>
    </form>
  );
};

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

export default PetForm;