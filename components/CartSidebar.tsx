"use client";
import React from 'react';
import { FaShoppingCart, FaTimes, FaMinus, FaPlus, FaWhatsapp, FaStore, FaMotorcycle } from 'react-icons/fa';

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
  // 👇 Agregamos las props que vienen de WebControlCell
  metodoEnvio: string;
  setMetodoEnvio: (metodo: string) => void;
  direccion: string;
  setDireccion: (dir: string) => void;
}

export default function CartSidebar({ 
  carrito, 
  setMostrarCarrito, 
  modificarCantidad, 
  totalCarrito, 
  finalizarCompraWhatsApp, 
  azulModerno,
  metodoEnvio,
  setMetodoEnvio,
  direccion,
  setDireccion
}: CartSidebarProps) {

  // Función para validar antes de enviar
  const handleFinalizar = () => {
    if (metodoEnvio === 'envio' && direccion.trim() === '') {
      alert('Por favor, ingresá tu domicilio para el envío.');
      return;
    }
    // Como WebControlCell ya sabe la dirección y el método, solo ejecutamos la función
    finalizarCompraWhatsApp();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', cursor: 'pointer' }} onClick={() => setMostrarCarrito(false)}></div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '100%', backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', zIndex: 4001 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaShoppingCart color={azulModerno} /> Mi Pedido
          </h3>
          <button onClick={() => setMostrarCarrito(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>
            <FaTimes size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>El carrito está vacío.</div>
          ) : (
            carrito.map((item) => (
              <div key={item.producto.id} style={{ display: 'flex', gap: '15px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={item.producto.img} alt={item.producto.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.2' }}>{item.producto.nombre}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ color: azulModerno, fontWeight: 'bold' }}>${(item.producto.precio * item.cantidad).toLocaleString('es-AR')}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                      <button onClick={() => modificarCantidad(item.producto.id, -1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}><FaMinus size={10} /></button>
                      <span style={{ fontSize: '0.85rem', width: '15px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button onClick={() => modificarCantidad(item.producto.id, 1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}><FaPlus size={10} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            
            {/* --- SECCIÓN DE OPCIONES DE ENTREGA --- */}
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Opciones de entrega:</span>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '10px', backgroundColor: metodoEnvio === 'retiro' ? azulModerno : 'rgba(255,255,255,0.05)', borderRadius: '10px', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <input type="radio" name="envio" value="retiro" checked={metodoEnvio === 'retiro'} onChange={() => setMetodoEnvio('retiro')} style={{ display: 'none' }} />
                  <FaStore size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: metodoEnvio === 'retiro' ? 'bold' : 'normal' }}>Retiro en local</span>
                </label>

                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '10px', backgroundColor: metodoEnvio === 'envio' ? azulModerno : 'rgba(255,255,255,0.05)', borderRadius: '10px', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <input type="radio" name="envio" value="envio" checked={metodoEnvio === 'envio'} onChange={() => setMetodoEnvio('envio')} style={{ display: 'none' }} />
                  <FaMotorcycle size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: metodoEnvio === 'envio' ? 'bold' : 'normal' }}>A domicilio</span>
                </label>
              </div>

              {/* Input de dirección condicional */}
              {metodoEnvio === 'envio' && (
                <div style={{ marginTop: '5px', animation: 'fadeIn 0.3s ease-in-out' }}>
                  <input 
                    type="text" 
                    placeholder="Ej: San Martín 1234, Ciudad" 
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}
            </div>
            {/* --- FIN SECCIÓN DE ENTREGA --- */}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: azulModerno }}>${totalCarrito.toLocaleString('es-AR')}</span>
            </div>
            
            <button onClick={handleFinalizar} style={{ width: '100%', backgroundColor: '#25d366', color: '#fff', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s' }}>
              <FaWhatsapp size={20} /> REALIZAR PEDIDO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}