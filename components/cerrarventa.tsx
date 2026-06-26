"use client";
import React, { useState, useEffect } from 'react';
import { FaStore, FaMotorcycle, FaWhatsapp, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  img: string;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CerrarVentaProps {
  carrito: ItemCarrito[];
  azulModerno: string;
  metodoEnvio: string;
  setMetodoEnvio: (metodo: string) => void;
  direccion: string;
  setDireccion: (dir: string) => void;
}

const WHATSAPP_NUMERO = '5492614603074';

export default function CerrarVenta({
  carrito, azulModerno, metodoEnvio, setMetodoEnvio, direccion, setDireccion
}: CerrarVentaProps) {

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');

  // Se activa solo cuando MercadoPago redirige de vuelta con ?status=approved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status') || params.get('collection_status');
      if (status === 'approved') {
        setMostrarModal(true);
      }
    }
  }, []);

  const handleEnviarWhatsApp = () => {
    if (nombreCliente.trim() === '' || telefonoCliente.trim() === '') {
      alert('Por favor, ingresá tu Nombre y Teléfono.');
      return;
    }
    if (metodoEnvio === 'envio' && direccion.trim() === '') {
      alert('Por favor, ingresá tu Dirección para el envío.');
      return;
    }

    const detalleProductos = carrito.length > 0
      ? carrito.map(item => `• ${item.producto.nombre} (x${item.cantidad})`).join('\n')
      : 'el producto';

    const entregaStr = metodoEnvio === 'envio'
      ? `Envío a domicilio: ${direccion}`
      : 'Retiro en local';

    const mensaje =
      `Hola, ya pagué y quiero coordinar la entrega 🎉\n\n` +
      `*Productos:*\n${detalleProductos}\n\n` +
      `*Datos de entrega:*\n` +
      `- Nombre: ${nombreCliente}\n` +
      `- Teléfono: ${telefonoCliente}\n` +
      `- Método: ${entregaStr}`;

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem'
  };

  const deliveryBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '12px', borderRadius: '12px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '0.88rem', transition: 'all 0.2s',
    border: active ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)',
    backgroundColor: active ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
    color: active ? '#fff' : '#94a3b8'
  });

  if (!mostrarModal) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px', boxSizing: 'border-box'
    }}>

      {/* Fondo — NO cierra al hacer click para evitar pérdida accidental */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)'
      }} />

      {/* Modal */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: '460px',
        backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '28px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        zIndex: 5001, boxSizing: 'border-box', color: '#fff',
        display: 'flex', flexDirection: 'column', gap: '18px'
      }}>

        {/* Botón cerrar (esquina) */}
        <button
          onClick={() => setMostrarModal(false)}
          title="Cerrar (podés volver más tarde desde el carrito)"
          style={{
            position: 'absolute', top: '18px', right: '18px',
            backgroundColor: 'transparent', border: 'none',
            color: '#475569', cursor: 'pointer', lineHeight: 1
          }}
        >
          <FaTimes size={16} />
        </button>

        {/* Encabezado */}
        <div style={{ textAlign: 'center', paddingTop: '4px' }}>
          <FaCheckCircle color="#25d366" size={48} style={{ marginBottom: '12px' }} />
          <h2 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 800 }}>
            ¡Tu pago fue aprobado!
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Completá los datos de entrega para que el local pueda coordinar con vos.
          </p>
        </div>

        {/* Método de entrega */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Forma de entrega
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setMetodoEnvio('retiro')} style={deliveryBtnStyle(metodoEnvio === 'retiro')}>
              <FaStore color={metodoEnvio === 'retiro' ? azulModerno : '#64748b'} /> Retiro en local
            </button>
            <button onClick={() => setMetodoEnvio('envio')} style={deliveryBtnStyle(metodoEnvio === 'envio')}>
              <FaMotorcycle color={metodoEnvio === 'envio' ? azulModerno : '#64748b'} /> A domicilio
            </button>
          </div>
        </div>

        {/* Dirección (solo si eligió envío) */}
        {metodoEnvio === 'envio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dirección
            </span>
            <input
              type="text"
              placeholder="Calle, número, localidad"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* Datos del cliente */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tus datos
          </span>
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Número de teléfono"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Botón WhatsApp */}
        <button
          onClick={handleEnviarWhatsApp}
          style={{
            width: '100%', backgroundColor: '#25d366', color: '#fff',
            padding: '16px', borderRadius: '14px', border: 'none',
            fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
          }}
        >
          <FaWhatsapp size={20} /> Confirmar y coordinar entrega
        </button>

      </div>
    </div>
  );
}