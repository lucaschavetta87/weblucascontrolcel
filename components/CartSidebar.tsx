"use client";
import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart, FaTimes, FaMinus, FaPlus,
  FaWhatsapp, FaStore, FaMotorcycle, FaCheckCircle,
  FaCreditCard, FaBoxOpen, FaInfoCircle
} from 'react-icons/fa';
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

const WHATSAPP_NUMERO = '5492614603074';

export default function CartSidebar({
  carrito, setMostrarCarrito, modificarCantidad, totalCarrito,
  finalizarCompraWhatsApp, azulModerno, metodoEnvio, setMetodoEnvio,
  direccion, setDireccion
}: CartSidebarProps) {

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [pasoEntrega, setPasoEntrega] = useState(false);
  const [cargandoPago, setCargandoPago] = useState(false);

  // DETECCIÓN AUTOMÁTICA AL VOLVER DE MERCADO PAGO
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status') || params.get('collection_status');

      if (status === 'approved') {
        // Al ser aprobado, ocultamos este sidebar para dejar ver el modal de CerrarVenta
        setMostrarCarrito(false);
      } else if (status && status !== 'approved') {
        // Pago fallido o pendiente → volver al carrito con sidebar abierto
        setPasoEntrega(false);
        setMostrarCarrito(true);
      }
    }
  }, [setMostrarCarrito]);

  const handlePagarMercadoPago = async () => {
    try {
      setCargandoPago(true);
      const { data, error } = await supabase.from('pedidos_web').insert([{
        nombre: "Pendiente de datos",
        telefono: "Pendiente",
        productos: carrito,
        total: totalCarrito,
        metodo_envio: metodoEnvio,
        direccion: metodoEnvio === 'envio' ? direccion : 'Retiro en local',
        estado: 'pendiente'
      }]).select().single();

      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, idPedido: data?.id || 0 })
      });
      const { init_point } = await res.json();

      if (init_point) {
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

  const handleConsultarWhatsApp = () => {
    if (carrito.length === 0) return;
    const listaProductos = carrito
      .map(item => `• ${item.producto.nombre} (x${item.cantidad}) - $${(item.producto.precio * item.cantidad).toLocaleString('es-AR')}`)
      .join('\n');
    const mensaje = `Hola! Quiero consultar disponibilidad de estos productos:\n\n${listaProductos}\n\n*Total estimado: $${totalCarrito.toLocaleString('es-AR')}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
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
    const mensaje = `Hola ya pague ${detalleProductos}, coordinamos entrega?\n\n*Datos de entrega:*\n- Nombre: ${nombreCliente}\n- Teléfono: ${telefonoCliente}\n- Método: ${entregaStr}`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // ─── Estilos reutilizables ───────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem',
    transition: 'border-color 0.2s'
  };

  const deliveryBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '12px', borderRadius: '12px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.2s',
    border: active ? `2px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.1)',
    backgroundColor: active ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
    color: active ? '#fff' : '#94a3b8'
  });

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>

      {/* Overlay */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', cursor: 'pointer' }}
        onClick={() => setMostrarCarrito(false)}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: '420px', height: '100%',
        backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.6)', zIndex: 4001
      }}>

        {/* ══════════════════════════════════════════════════
            VISTA POST-PAGO: DATOS DE ENTREGA
        ══════════════════════════════════════════════════ */}
        {pasoEntrega ? (
          <div style={{ padding: '30px 22px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', boxSizing: 'border-box', gap: '20px' }}>

            <div style={{ textAlign: 'center' }}>
              <FaCheckCircle color="#25d366" size={48} style={{ marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>¡Pago procesado!</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Completá los datos para coordinar la entrega directamente por WhatsApp.
              </p>
            </div>

            {/* Método de entrega */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forma de entrega</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setMetodoEnvio('retiro')} style={deliveryBtnStyle(metodoEnvio === 'retiro')}>
                  <FaStore color={metodoEnvio === 'retiro' ? azulModerno : '#64748b'} /> Retiro en local
                </button>
                <button onClick={() => setMetodoEnvio('envio')} style={deliveryBtnStyle(metodoEnvio === 'envio')}>
                  <FaMotorcycle color={metodoEnvio === 'envio' ? azulModerno : '#64748b'} /> A domicilio
                </button>
              </div>
            </div>

            {metodoEnvio === 'envio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dirección</span>
                <input type="text" placeholder="Calle, número, localidad" value={direccion} onChange={e => setDireccion(e.target.value)} style={inputStyle} />
              </div>
            )}

            {/* Datos del cliente */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tus datos</span>
              <input type="text" placeholder="Nombre y Apellido" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} style={inputStyle} />
              <input type="tel" placeholder="Número de teléfono" value={telefonoCliente} onChange={e => setTelefonoCliente(e.target.value)} style={inputStyle} />
            </div>

            <button onClick={handleEnviarWhatsAppPostPago} style={{
              width: '100%', backgroundColor: '#25d366', color: '#fff',
              padding: '16px', borderRadius: '14px', border: 'none',
              fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
              letterSpacing: '0.03em', transition: 'opacity 0.2s'
            }}>
              <FaWhatsapp size={20} /> Confirmar y coordinar entrega
            </button>
          </div>

        ) : (
          <>
            {/* ══════════════════════════════════════════════════
                VISTA PRINCIPAL DEL CARRITO
            ══════════════════════════════════════════════════ */}

            {/* Header */}
            <div style={{
              padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaShoppingCart color={azulModerno} size={18} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Mi pedido</h3>
                {totalItems > 0 && (
                  <span style={{
                    backgroundColor: azulModerno, color: '#fff',
                    borderRadius: '20px', padding: '2px 9px',
                    fontSize: '0.78rem', fontWeight: 700
                  }}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                )}
              </div>
              <button onClick={() => setMostrarCarrito(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', transition: 'color 0.2s', lineHeight: 1 }}>
                <FaTimes size={18} />
              </button>
            </div>

            {/* Lista de productos */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {carrito.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <FaBoxOpen size={36} color="#334155" />
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>El carrito está vacío</p>
                </div>
              ) : (
                <>
                  {carrito.map((item) => (
                    <div key={item.producto.id} style={{
                      display: 'flex', gap: '14px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      padding: '12px', borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <img
                        src={item.producto.img}
                        alt={item.producto.nombre}
                        style={{ width: '62px', height: '62px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.producto.nombre}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          ${item.producto.precio.toLocaleString('es-AR')} c/u
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ color: azulModerno, fontWeight: 700, fontSize: '0.95rem' }}>
                            ${(item.producto.precio * item.cantidad).toLocaleString('es-AR')}
                          </span>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '5px 8px'
                          }}>
                            <button onClick={() => modificarCantidad(item.producto.id, -1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                              <FaMinus size={10} />
                            </button>
                            <span style={{ fontSize: '0.85rem', minWidth: '16px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>{item.cantidad}</span>
                            <button onClick={() => modificarCantidad(item.producto.id, 1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                              <FaPlus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Resumen de totales */}
                  <div style={{
                    marginTop: '4px', padding: '14px 16px', borderRadius: '14px',
                    backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                      <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                      <span>${totalCarrito.toLocaleString('es-AR')}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                      <span>Total</span>
                      <span style={{ color: azulModerno }}>${totalCarrito.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer con botones */}
            {carrito.length > 0 && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Aviso informativo */}
                <div style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '12px', padding: '12px 14px'
                }}>
                  <FaInfoCircle color={azulModerno} size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Luego de completar el pago, ingresá tus datos para coordinar el envío o retiro del pedido.
                  </p>
                </div>

                {/* Botón MercadoPago */}
                <button
                  onClick={handlePagarMercadoPago}
                  disabled={cargandoPago}
                  style={{
                    width: '100%', backgroundColor: azulModerno, color: '#fff',
                    padding: '15px', borderRadius: '13px', border: 'none',
                    fontWeight: 800, fontSize: '0.95rem', cursor: cargandoPago ? 'not-allowed' : 'pointer',
                    opacity: cargandoPago ? 0.6 : 1, transition: 'all 0.25s',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                    letterSpacing: '0.02em'
                  }}
                >
                  <FaCreditCard size={17} />
                  {cargandoPago ? 'Redireccionando...' : 'Pagar con MercadoPago'}
                </button>

                {/* Divisor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
                  <span style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>o si preferís</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
                </div>

                {/* Botón Consultar por WhatsApp */}
                <button
                  onClick={handleConsultarWhatsApp}
                  style={{
                    width: '100%', backgroundColor: 'transparent', color: '#25d366',
                    padding: '14px', borderRadius: '13px',
                    border: '1px solid rgba(37,211,102,0.35)',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'all 0.25s',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '9px'
                  }}
                >
                  <FaWhatsapp size={17} /> Consultar disponibilidad
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}