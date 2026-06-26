"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Aurora from '../components/Aurora'; 
import { supabase } from '../lib/supabase';
import WhatsAppChat from '../components/WhatsAppChat';
import { FaCheckCircle } from 'react-icons/fa';
import GoogleReviews from '../components/GoogleReviews';

// Importación de los nuevos componentes modulares
import Navbar from '../components/Navbar';
import FloatingSocials from '../components/FloatingSocials';
import InicioView from '../components/InicioView';
import CatalogoView from '../components/CatalogoView';
import CartSidebar from '../components/CartSidebar';
import CerrarVenta from '../components/cerrarventa';

interface Producto { id: number; nombre: string; precio: number; img: string; categoria: string; }
interface EquipoData { nombre: string; equipo: string; estado_orden: string; falla: string; fecha: string; }
interface ItemCarrito { producto: Producto; cantidad: number; }

export default function WebControlCell() {
  const azulModerno = "#3b82f6";

  // --- ESTADOS DE ENVÍO ---
  const [metodoEnvio, setMetodoEnvio] = useState('retiro'); 
  const [direccion, setDireccion] = useState('');

  // --- ESTADOS DE REPARACIÓN Y NAVEGACIÓN ---
  const [ordenBusqueda, setOrdenBusqueda] = useState('');
  const [telBusqueda, setTelBusqueda] = useState('');
  const [equipo, setEquipo] = useState<EquipoData | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [vista, setVista] = useState<'inicio' | 'catalogo'>('inicio');

  // --- ESTADOS DE PRODUCTOS Y CARRITO ---
  const [productosBase, setProductosBase] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<'todos' | 'celulares' | 'accesorios'>('todos');
  const [busquedaTermino, setBusquedaTermino] = useState('');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  // RECUPERAR RESPALDO DEL CARRITO SI VOLVEMOS DE MERCADO PAGO APROBADO
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status') || params.get('collection_status');
      if (status === 'approved') {
        const respaldo = localStorage.getItem('carrito_respaldo');
        if (respaldo) {
          setCarrito(JSON.parse(respaldo));
          // Opcional: limpiar una vez restaurado para no ensuciar la memoria
          localStorage.removeItem('carrito_respaldo');
        }
      }
    }
  }, []);

  // --- TRAER STOCK DE SUPABASE ---
  const cargarProductosNube = async () => {
    try {
      const { data, error } = await supabase.from('stock').select('*').gt('cantidad', 0).order('nombre', { ascending: true });
      if (error) throw error;
      if (data) {
        const mapeados = data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          precio: Number(item.precio_venta || item.precio || 0),
          img: item.imagen_url || `https://picsum.photos/seed/${item.id}/300/300`,
          categoria: String(item.categoria || 'celulares').toLowerCase().trim()
        }));
        setProductosBase(mapeados);
      }
    } catch (err) { console.error("Error cargando stock:", err); }
  };

  useEffect(() => { cargarProductosNube(); }, []);

  // --- FILTRADO Y PAGINACIÓN ---
  const productosFiltrados = useMemo(() => {
    return productosBase.filter(p => {
      const pasaCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva;
      return pasaCategoria && p.nombre.toLowerCase().includes(busquedaTermino.toLowerCase().trim());
    });
  }, [productosBase, categoriaActiva, busquedaTermino]);

  useEffect(() => { setPaginaActual(1); }, [categoriaActiva, busquedaTermino]);

  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * productosPorPagina;
    return productosFiltrados.slice(inicio, inicio + productosPorPagina);
  }, [productosFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // --- REPARACIONES ---
  const buscarEstado = async () => {
    if (!ordenBusqueda || !telBusqueda) return setErrorBusqueda('Por favor, ingresá Nro de Orden y Teléfono.');
    setCargando(true); setErrorBusqueda(''); setEquipo(null);
    try {
      const idNumerico = Number(ordenBusqueda.trim());
      if (isNaN(idNumerico)) { setErrorBusqueda('El número de orden debe ser válido.'); setCargando(false); return; }

      const { data, error } = await supabase.from('ordenes').select('nombre, equipo, estado_orden, falla, fecha').eq('telefono', telBusqueda.trim()).eq('id', idNumerico).maybeSingle();
      if (error || !data) setErrorBusqueda('No encontramos ninguna orden con esos datos.');
      else setEquipo(data as EquipoData);
    } catch (err) { setErrorBusqueda('Error de conexión con el servidor.'); }
    setCargando(false);
  };

  // --- MANEJO DEL CARRITO ---
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      return existe ? prev.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item) : [...prev, { producto, cantidad: 1 }];
    });
    setNotificacion("Producto añadido al carrito correctamente");
  };

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => setNotificacion(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  const modificarCantidad = (id: number, delta: number) => {
    setCarrito(prev => prev.map(item => item.producto.id === id ? { ...item, cantidad: item.cantidad + delta } : item).filter(item => item.cantidad > 0));
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const finalizarCompraWhatsApp = () => {
    if (carrito.length === 0) return;
    
    let mensaje = `Hola ControlCel! Te paso mi pedido:\n\n`;
    
    carrito.forEach(item => { 
      mensaje += `- ${item.cantidad}x ${item.producto.nombre} ($${(item.producto.precio * item.cantidad).toLocaleString('es-AR')})\n`; 
    });
    
    mensaje += `\n*Total: $${totalCarrito.toLocaleString('es-AR')}*\n\n`;
    
    if (metodoEnvio === 'envio') {
      mensaje += `*Método:* Envío a domicilio\n`;
      mensaje += `*Dirección:* ${direccion || 'No especificada'}\n\n`;
    } else {
      mensaje += `*Método:* Retiro en el local\n\n`;
    }
    
    mensaje += `¿Tienen disponibilidad para armar el pedido?`;
    
    window.open(`https://wa.me/5492614603074?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const estiloTab = (idTab: 'todos' | 'celulares' | 'accesorios') => {
    const esActivo = categoriaActiva === idTab;
    return {
      padding: '10px 24px', borderRadius: '30px', border: `1px solid ${esActivo ? azulModerno : 'rgba(255,255,255,0.1)'}`,
      backgroundColor: esActivo ? azulModerno : 'rgba(0,0,0,0.4)', color: '#fff', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '0.85rem',
      textTransform: 'uppercase' as const, letterSpacing: '1px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: esActivo ? 'scale(1.05)' : 'scale(1)', boxShadow: esActivo ? `0 0 15px ${azulModerno}60` : 'none'
    };
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora colorStops={["#3b82f6", "#7cff67", "#5227FF"]} amplitude={1} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar vista={vista} setVista={setVista} cantidadTotal={cantidadTotal} setMostrarCarrito={setMostrarCarrito} azulModerno={azulModerno} />
        
        <FloatingSocials />

        {vista === 'inicio' ? (
          <InicioView ordenBusqueda={ordenBusqueda} setOrdenBusqueda={setOrdenBusqueda} telBusqueda={telBusqueda} setTelBusqueda={setTelBusqueda} buscarEstado={buscarEstado} cargando={cargando} errorBusqueda={errorBusqueda} equipo={equipo} azulModerno={azulModerno} />
        ) : (
          <CatalogoView cantidadTotal={cantidadTotal} setMostrarCarrito={setMostrarCarrito} productosFiltrados={productosFiltrados} productosPaginados={productosPaginados} busquedaTermino={busquedaTermino} setBusquedaTermino={setBusquedaTermino} categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} agregarAlCarrito={agregarAlCarrito} azulModerno={azulModerno} estiloTab={estiloTab} />
        )}

        <GoogleReviews azulModerno={azulModerno} />

        <section style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', marginBottom: '60px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>¿Dónde <span style={{ color: azulModerno }}>estamos?</span></h2>
              <p style={{ margin: '10px 0' }}>📍 Salta 1161, Mendoza</p>
              <p style={{ opacity: 0.8 }}>⏰ Lun a Vie: 08:30 a 18:00 (Corrido)</p>
            </div>
            <div style={{ height: '300px', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe src="https://maps.google.com/maps?q=Salta%201161,%20Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" title="Ubicación de ControlCel"></iframe>
            </div>
          </div>
        </section>

        <WhatsAppChat />
        <footer style={{ textAlign: 'center', padding: '40px 5%', opacity: 0.4, fontSize: '0.8rem' }}>© 2026 ControlCel - Mendoza</footer>
      </div>

      {/* ACÁ ABAJO VAN LOS MODALES Y EL CARRITO DE VERDAD */}
      {mostrarCarrito && (
        <CartSidebar 
          carrito={carrito} 
          setMostrarCarrito={setMostrarCarrito} 
          modificarCantidad={modificarCantidad} 
          totalCarrito={totalCarrito} 
          finalizarCompraWhatsApp={finalizarCompraWhatsApp} 
          azulModerno={azulModerno} 
          metodoEnvio={metodoEnvio}
          setMetodoEnvio={setMetodoEnvio}
          direccion={direccion}
          setDireccion={setDireccion}
        />
      )}

      <CerrarVenta 
        carrito={carrito}
        azulModerno={azulModerno}
        metodoEnvio={metodoEnvio}
        setMetodoEnvio={setMetodoEnvio}
        direccion={direccion}
        setDireccion={setDireccion}
      />

      {notificacion && (
        <div style={{ position: 'fixed', top: '95px', right: '25px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(15px)', border: `1px solid ${azulModerno}`, borderRadius: '16px', padding: '12px 24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 5000, boxShadow: `0 10px 25px rgba(59, 130, 246, 0.25)`, fontWeight: '600', fontSize: '0.9rem' }}>
          <FaCheckCircle color="#10b981" size={18} /> {notificacion}
        </div>
      )}
    </div>
  );
}