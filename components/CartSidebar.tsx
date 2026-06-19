"use client";
import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaMinus, FaPlus, FaWhatsapp, FaStore, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../lib/supabase'; 

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

interface CartSidebarProps {
  carrito: ItemCarrito[];
  setMostrarCarrito: (mostrar: boolean) => void;
  modificarCantidad: (id: number, delta: number) => void;
  totalCarrito: number;
  finalizarCompraWhatsApp: () => void; 
  azulModerno: string;
  metodoEnvio: string;
  setMetodoEnvio: (metodo: string) => void;
  direccion: string;
  setDireccion: (dir: string) => void;
}

export default function CartSidebar({ 
  carrito, setMostrarCarrito, modificarCantidad, totalCarrito, 
  finalizarCompraWhatsApp, azulModerno, metodoEnvio, setMetodoEnvio, 
  direccion, setDireccion 
}: CartSidebarProps) {

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [pasoEntrega, setPasoEntrega] = useState(false);
  const [cargandoPago, setCargandoPago] = useState(false);

  const handlePagarMercadoPago = async () => {
    try {
      setCargandoPago(true);
      // 1. Registramos en Supabase de forma interna primero
      const { data, error } = await supabase.from('pedidos_web').insert([{ 
        nombre: "Pendiente de datos", telefono: "Pendiente", productos: carrito, 
        total: totalCarrito, metodo_envio: metodoEnvio, 
        direccion: metodoEnvio === 'envio' ? direccion : 'Retiro en local', estado: 'pendiente'
      }]).select().single();

      // 2. Pedimos el init_point a tu backend
      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, idPedido: data?.id || 0 })
      });
      const { init_point } = await res.json();
      
      if (init_point) {
        // CAMBIO CLAVE: Redirección en la misma ventana para evitar bloqueos en celulares
        window.location.href = init_point;
      } else {
        alert("No se pudo generar el enlace de pago.");
        setCargandoPago(false);
      }
    } catch (err) { 
      alert("Error al conectar con Mercado Pago."); 
      setCargandoPago(false);
    }
  };

  const handleEnviarWhatsAppPostPago = () => {
    if (nombreCliente.trim() === '' || telefonoCliente.trim() === '') {
      alert('Por favor, ingresá tu Nombre y Teléfono para la entrega.');
      return;
    }
    if (metodoEnvio === 'envio' && direccion.trim() === '') {
      alert('Por favor, ingresá tu Dirección para el envío.');
      return;
    }

    const detalleProductos = carrito.map(item => `${item.producto.nombre} (x${item.cantidad})`).join(', ');
    const entregaStr = metodoEnvio === 'envio' ? `Envío a domicilio: ${direccion}` : 'Retiro en local';

    const mensaje = `Hola ya pague ${detalleProductos}, coordinamos entrega? \n\n*Datos de entrega:*\n- Nombre: ${nombreCliente}\n- Teléfono: ${telefonoCliente}\n- Método: ${entregaStr}`;
    
    const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', cursor: 'pointer' }} onClick={() => setMostrarCarrito(false)}></div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '100%', backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', zIndex: 4001 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
            <FaShoppingCart color={azulModerno} /> Mi Pedido
          </h3>
          <button onClick={() => setMostrarCarrito(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px', color: '#fff' }}>El carrito está vacío.</div>
          ) : (
            carrito.map((item) => (
              <div key={item.producto.id} style={{ display: 'flex', gap: '15px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={item.producto.img} alt={item.producto.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.2', color: '#fff' }}>{item.producto.nombre}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ color: azulModerno, fontWeight: 'bold' }}>${(item.producto.precio * item.cantidad).toLocaleString('es-AR')}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                      <button onClick={() => modificarCantidad(item.producto.id, -1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}><FaMinus size={10} /></button>
                      <span style={{ fontSize: '0.85rem', width: '15px', textAlign: 'center', color: '#fff' }}>{item.cantidad}</span>
                      <button onClick={() => modificarCantidad(item.producto.id, 1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}><FaPlus size={10} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TOTAL Y BOTONES */}
        {carrito.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
              <span>Total:</span>
              <span style={{ color: azulModerno }}>${totalCarrito.toLocaleString('es-AR')}</span>
            </div>
            
            {!pasoEntrega ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={handlePagarMercadoPago} 
                  disabled={cargandoPago}
                  style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', opacity: cargandoPago ? 0.6 : 1 }}
                >
                  {cargandoPago ? 'REDIRECCIONANDO...' : 'PAGAR CON MERCADOPAGO'}
                </button>

                {/* Si el cliente se fue a MP y regresó usando el botón 'Atrás' del celu, puede declarar que ya pagó */}
                <button 
                  onClick={() => setPasoEntrega(true)} 
                  style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '12px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  ¿Ya realizaste el pago? Cargar datos de entrega
                </button>
              </div>
            ) : (
              <>
                <div style={{ color: '#25d366', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <FaCheckCircle /> ¡Compra realizada correctamente! Complete los datos de entrega:
                </div>

                {/* SECCIÓN DE MÉTODO DE ENTREGA */}
                <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>Forma de entrega:</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => setMetodoEnvio('retiro')} 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', border: metodoEnvio === 'retiro' ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: metodoEnvio === 'retiro' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff' }}
                    >
                      <FaStore color={metodoEnvio === 'retiro' ? azulModerno : '#94a3b8'} /> Local
                    </button>
                    <button 
                      onClick={() => setMetodoEnvio('envio')} 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', border: metodoEnvio === 'envio' ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: metodoEnvio === 'envio' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff' }}
                    >
                      <FaMotorcycle color={metodoEnvio === 'envio' ? azulModerno : '#94a3b8'} /> Domicilio
                    </button>
                  </div>
                </div>

                {/* CAMPO DE DIRECCIÓN DINÁMICO */}
                {metodoEnvio === 'envio' && (
                  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Calle, Número, Localidad" 
                      value={direccion} 
                      onChange={(e) => setDireccion(e.target.value)} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                )}

                {/* SECCIÓN DE DATOS DEL CLIENTE */}
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Nombre y Apellido" 
                    value={nombreCliente} 
                    onChange={(e) => setNombreCliente(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                  />
                  <input 
                    type="tel" 
                    placeholder="Tu Teléfono" 
                    value={telefonoCliente} 
                    onChange={(e) => setTelefonoCliente(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={handleEnviarWhatsAppPostPago} style={{ width: '100%', backgroundColor: '#25d366', color: '#fff', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <FaWhatsapp size={20} /> CONFIRMAR ENVÍO
                  </button>
                  
                  <button onClick={() => setPasoEntrega(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Volver a intentar el pago
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}