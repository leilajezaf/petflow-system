import React, { useState, useEffect } from 'react';
import { COAT_TYPES } from './PetForm';

const mapCoatType = (coat) => {
  const found = COAT_TYPES.find((item) => item.value === coat);
  return found ? found.label : coat;
};

const PetList = ({ refreshTrigger }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pets');
      if (!response.ok) {
        throw new Error('Error al obtener la lista de mascotas');
      }
      const data = await response.json();
      setPets(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [refreshTrigger]);

  const mapSpecies = (species) => {
    return species === 'DOG' ? '🐶 Perro' : species === 'CAT' ? '🐱 Gato' : species;
  };

  const mapCoatType = (coat) => {
    const coats = {
    corto_raso: 'Corto / Raso',
    corto_doble_desmuda: 'Corto Doble',
    manto_doble_medio: 'Manto Doble Medio',
    manto_doble_largo: 'Manto Doble Largo',
    manto_nordico_denso: 'Manto Nórdico Denso',
    pelo_largo_lacio: 'Pelo Largo Lacio / Sedoso',
    pelo_mota_rizado: 'Pelo Rizado / Mota',
    pelo_duro_alambre: 'Pelo Duro / Alambre',
    pelo_encordado: 'Pelo Encordado',
    sin_pelo: 'Sin Pelo',
    anudado_fieltrado: 'Anudado / Fieltrado'
  };
  return coats[coat] || coat;
  };

  if (loading) return <p style={statusStyle}>Cargando mascotas...</p>;
  if (error) return <p style={{ ...statusStyle, color: '#dc2626' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>Mascotas Registradas</h2>
        <button onClick={fetchPets} style={refreshButtonStyle}>
          🔄 Actualizar
        </button>
      </div>

      {pets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px 0' }}>
          No hay mascotas registradas aún.
        </p>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={thStyle}>Mascota</th>
                <th style={thStyle}>Especie / Raza</th>
                <th style={thStyle}>Peso</th>
                <th style={thStyle}>Pelaje</th>
                <th style={thStyle}>Dueño/a</th>
                <th style={thStyle}>Contacto</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet._id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0369a1' }}>
                    {pet.petName}
                  </td>
                  <td style={tdStyle}>
                    {mapSpecies(pet.species)} {pet.breed ? `- ${pet.breed}` : ''}
                  </td>
                  <td style={tdStyle}>{pet.weightKg ? `${pet.weightKg} kg` : '-'}</td>
                  <td style={tdStyle}>{mapCoatType(pet.coatType)}</td>
                  <td style={tdStyle}>{pet.ownerName || '-'}</td>
                  <td style={tdStyle}>{pet.ownerPhone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Estilos en JS
const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  margin: '20px auto',
  maxWidth: '800px'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const refreshButtonStyle = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const tableWrapperStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.9rem'
};

const tableHeaderRowStyle = {
  backgroundColor: '#f9fafb',
  borderBottom: '2px solid #e5e7eb'
};

const thStyle = {
  padding: '10px 12px',
  color: '#374151',
  fontWeight: '600'
};

const trStyle = {
  borderBottom: '1px solid #f3f4f6'
};

const tdStyle = {
  padding: '10px 12px',
  color: '#4b5563'
};

const statusStyle = {
  textAlign: 'center',
  padding: '20px',
  fontSize: '0.95rem',
  color: '#4b5563'
};

export default PetList;