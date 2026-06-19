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

export default function CerrarVenta({
  carrito, azulModerno, metodoEnvio, setMetodoEnvio, direccion, setDireccion
}: CerrarVentaProps) {
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');

  // Detectar automáticamente si viene de Mercado Pago
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

    // Armamos el listado de productos comprados
    const detalleProductos = carrito.length > 0 
      ? carrito.map(item => `${item.producto.nombre} (x${item.cantidad})`).join(', ')
      : 'el producto';

    const entregaStr = metodoEnvio === 'envio' ? `Envío a domicilio: ${direccion}` : 'Retiro en local';

    // Tu mensaje personalizado exacto
    const mensaje = `Hola ya pague ${detalleProductos}, coordinamos entrega? \n\n*Datos de entrega:*\n- Nombre: ${nombreCliente}\n- Teléfono: ${telefonoCliente}\n- Método: ${entregaStr}`;
    
    const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  };

  if (!mostrarModal) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
      {/* Fondo borroso */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}></div>
      
      {/* Ventana de datos */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '450px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 5001, boxSizing: 'border-box', color: '#fff' }}>
        
        <button onClick={() => setMostrarModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5 }}>
          <FaTimes size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaCheckCircle color="#25d366" size={50} style={{ marginBottom: '10px' }} />
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>¡Tu pago se procesó correctamente!</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Completá los datos de entrega para finalizar tu pedido.</p>
        </div>

        {/* FORMA DE ENTREGA */}
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Forma de entrega:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setMetodoEnvio('retiro')} 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', border: metodoEnvio === 'retiro' ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: metodoEnvio === 'retiro' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff', transition: 'all 0.2s' }}
            >
              <FaStore color={metodoEnvio === 'retiro' ? azulModerno : '#94a3b8'} /> Local
            </button>
            <button 
              onClick={() => setMetodoEnvio('envio')} 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', border: metodoEnvio === 'envio' ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: metodoEnvio === 'envio' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff', transition: 'all 0.2s' }}
            >
              <FaMotorcycle color={metodoEnvio === 'envio' ? azulModerno : '#94a3b8'} /> Domicilio
            </button>
          </div>
        </div>

        {/* DIRECCIÓN SI ES ENVÍO */}
        {metodoEnvio === 'envio' && (
          <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Dirección de envío:</span>
            <input 
              type="text" 
              placeholder="Calle, Número, Localidad" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
        )}

        {/* DATOS DEL CLIENTE */}
        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Tus Datos:</span>
            <input 
              type="text" 
              placeholder="Nombre y Apellido" 
              value={nombreCliente} 
              onChange={(e) => setNombreCliente(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
          <input 
            type="tel" 
            placeholder="Número de Teléfono" 
            value={telefonoCliente} 
            onChange={(e) => setTelefonoCliente(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
          />
        </div>

        {/* BOTÓN WHATSAPP */}
        <button onClick={handleEnviarWhatsApp} style={{ width: '100%', backgroundColor: '#25d366', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <FaWhatsapp size={22} /> CONFIRMAR Y ENVIAR AL LOCAL
        </button>

      </div>
    </div>
  );
}