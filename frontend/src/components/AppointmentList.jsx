import React, { useState, useEffect } from 'react';

const STATUS_LABELS = {
  PENDING_DEPOSIT: { label: '⏳ Pendiente de Seña', bg: '#fef3c7', text: '#d97706' },
  CONFIRMED: { label: '✅ Confirmado', bg: '#dcfce7', text: '#15803d' },
  IN_SERVICE: { label: '✂️ En Servicio', bg: '#e0f2fe', text: '#0369a1' },
  COMPLETED: { label: '🎉 Completado', bg: '#f3f4f6', text: '#374151' },
  CANCELLED: { label: '❌ Cancelado', bg: '#fee2e2', text: '#b91c1c' }
};

const AppointmentList = ({ refreshTrigger, onPayClick }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      if (!response.ok) throw new Error('Error al cargar la agenda de turnos');
      const data = await response.json();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

  if (loading) return <p style={statusStyle}>Cargando turnos...</p>;
  if (error) return <p style={{ ...statusStyle, color: '#dc2626' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>Agenda de Turnos</h2>
        <button onClick={fetchAppointments} style={refreshButtonStyle}>
          🔄 Actualizar
        </button>
      </div>

      {appointments.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px 0' }}>
          No hay turnos agendados.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={thStyle}>Fecha / Hora</th>
                <th style={thStyle}>Mascota / Dueño</th>
                <th style={thStyle}>Servicio</th>
                <th style={thStyle}>Duración</th>
                <th style={thStyle}>Total / Seña</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => {
                const statusInfo = STATUS_LABELS[apt.status] || STATUS_LABELS.PENDING_DEPOSIT;
                const formattedDate = apt.appointmentDate
                  ? new Date(apt.appointmentDate).toLocaleString('es-AR', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })
                  : '-';

                return (
                  <tr key={apt._id} style={trStyle}>
                    <td style={{ ...tdStyle, fontWeight: '600' }}>{formattedDate} hs</td>
                    <td style={tdStyle}>
                      <div><strong>{apt.pet?.petName || 'Mascota'}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {apt.pet?.ownerName} ({apt.pet?.ownerPhone})
                      </div>
                    </td>
                    <td style={tdStyle}>{apt.serviceType}</td>
                    <td style={tdStyle}>{apt.calculatedDurationMinutes} min</td>
                    <td style={tdStyle}>
                      <div>${apt.totalPrice}</div>
                      <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                        Seña: ${apt.depositAmount}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text
                      }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {apt.status === 'PENDING_DEPOSIT' && (
                        <button
                          onClick={() => onPayClick && onPayClick(apt)}
                          style={payButtonStyle}
                        >
                          💳 Cobrar Seña
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  margin: '20px auto',
  maxWidth: '900px'
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
  fontSize: '0.875rem'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.875rem'
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

const payButtonStyle = {
  backgroundColor: '#009ee3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 10px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const statusStyle = {
  textAlign: 'center',
  padding: '20px',
  color: '#4b5563'
};

export default AppointmentList;