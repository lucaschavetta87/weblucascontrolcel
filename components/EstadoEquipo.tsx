"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configura tus credenciales de Supabase
const supabase = createClient('https://cetezqmkqjqaxjsqemhe.supabase.co', 'sb_publishable_rzifzJbfkb0VWVxiP26rWA_3JZc5Dau');

export default function ConsultaEstado() {
  const [ordenId, setOrdenId] = useState('');
  const [telefono, setTelefono] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');

  const consultarEstado = async () => {
    setError('');
    setResultado(null);

    // Buscamos en la tabla 'ordenes' que ya usa tu sistema de gestión
    const { data, error: supaError } = await supabase
      .from('ordenes')
      .select('nombre, equipo, estado_orden, falla, presupuesto_total')
      .filter('telefono', 'eq', telefono)
      .filter('id', 'ilike', `%${ordenId}`); // Busca por los últimos dígitos

    if (supaError || !data || data.length === 0) {
      setError('No se encontró ninguna orden con esos datos. Verificá e intentá de nuevo.');
    } else {
      setResultado(data[0]);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#fff', textAlign: 'center' }}>Consulta de Servicio Técnico</h2>
      <p style={{ color: '#94a3b8', textAlign: 'center' }}>Ingresá los datos de tu ticket</p>
      
      <div style={formStyle}>
        <input 
          placeholder="Nro de Orden (ej: 123456)" 
          value={ordenId} 
          onChange={(e) => setOrdenId(e.target.value)} 
          style={inputStyle}
        />
        <input 
          placeholder="Teléfono (sin 0 ni 15)" 
          value={telefono} 
          onChange={(e) => setTelefono(e.target.value)} 
          style={inputStyle}
        />
        <button onClick={consultarEstado} style={btnStyle}>CONSULTAR ESTADO</button>
      </div>

      {error && <p style={{ color: '#ef4444', marginTop: '20px' }}>{error}</p>}

      {resultado && (
        <div style={resultCard}>
          <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>✅ Orden Encontrada</h3>
          <p><strong>Cliente:</strong> {resultado.nombre}</p>
          <p><strong>Equipo:</strong> {resultado.equipo}</p>
          <p><strong>Falla:</strong> {resultado.falla}</p>
          <div style={badgeStyle(resultado.estado_orden)}>
            ESTADO: {resultado.estado_orden.toUpperCase()}
          </div>
          {resultado.estado_orden === 'Listo' && (
            <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>📍 Podés pasar a retirarlo por Salta 1161.</p>
          )}
        </div>
      )}
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { backgroundColor: '#1e293b', padding: '40px', borderRadius: '24px', maxWidth: '500px', margin: '20px auto', border: '1px solid #334155' };
const formStyle = { display: 'flex', flexDirection: 'column' as 'column', gap: '15px', marginTop: '20px' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' };
const btnStyle = { padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold' as 'bold', cursor: 'pointer' };
const resultCard = { marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', borderRadius: '15px', border: '1px solid #10b981', color: '#f8fafc' };
const badgeStyle = (estado: string) => ({
  marginTop: '10px',
  padding: '8px',
  borderRadius: '8px',
  textAlign: 'center' as 'center',
  fontWeight: 'bold' as 'bold',
  backgroundColor: estado === 'Listo' ? '#10b981' : '#f59e0b',
  color: '#fff'
});