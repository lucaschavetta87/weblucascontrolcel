"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Aurora from '../components/Aurora'; 
import ElectricBorder from '../components/ElectricBorder'; 
import TrueFocus from '../components/TrueFocus';
import BlurText from '../components/BlurText'; 
import { supabase } from '../lib/supabase';
import WhatsAppChat from '../components/WhatsAppChat';
import { FaInstagram, FaTiktok, FaWhatsapp, FaShoppingCart, FaTimes, FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';

// --- INTERFACES ---
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  img: string;
  categoria: string;
}

interface EquipoData {
  nombre: string;
  equipo: string;
  estado_orden: string;
  falla: string;
  fecha: string;
}

interface ServiceItemProps {
  title: string;
  icon: string;
  desc: string;
}

// --- NUEVA INTERFAZ PARA EL CARRITO ---
interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

// --- COMPONENTE DE SERVICIOS PULIDO ---
const ServiceItem = ({ title, icon, desc }: ServiceItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.03) translateY(-5px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
      }}
    >
      {/* @ts-ignore */}
      <ElectricBorder color="#3b82f6" speed={1} chaos={0.12} style={{ borderRadius: '32px' }}>
        <div 
          style={{ 
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)', 
            padding: '30px', 
            borderRadius: '30px', 
            textAlign: 'center', 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: isHovered ? '0 20px 40px rgba(59, 130, 246, 0.15)' : 'none',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <div style={{ 
            fontSize: '2.5rem', 
            backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)', 
            width: '70px', 
            height: '70px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '18px',
            margin: '0 auto 10px',
            transform: isHovered ? 'rotate(5deg) scale(1.05)' : 'none',
            transition: 'all 0.3s ease'
          }}>{icon}</div>
          <h3 style={{ fontWeight: '800', fontSize: '1.2rem', margin: 0, color: '#fff' }}>{title}</h3>
          <p style={{ fontSize: '0.9rem', opacity: isHovered ? 0.9 : 0.7, lineHeight: '1.5', margin: 0, transition: 'opacity 0.3s' }}>{desc}</p>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default function WebControlCell() {
  const azulModerno = "#3b82f6";

  // --- ESTADOS ORIGINALES ---
  const [ordenBusqueda, setOrdenBusqueda] = useState('');
  const [telBusqueda, setTelBusqueda] = useState('');
  const [equipo, setEquipo] = useState<EquipoData | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const [vista, setVista] = useState<'inicio' | 'catalogo'>('inicio');
  const [productosBase, setProductosBase] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<'todos' | 'celulares' | 'accesorios'>('todos');
  const [busquedaTermino, setBusquedaTermino] = useState('');
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // --- ESTADOS DE CARRITO ---
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // --- NUEVOS ESTADOS PARA LA PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  // --- CONEXIÓN Y CARGA DE STOCK DESDE SUPABASE ---
  const cargarProductosNube = async () => {
    try {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .gt('cantidad', 0)
        .order('nombre', { ascending: true });

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
    } catch (err) {
      console.error("Error cargando stock para la vitrina:", err);
    }
  };

  useEffect(() => {
    cargarProductosNube();
  }, []);

  // --- FILTRADO DINÁMICO COMBINADO ---
  const productosFiltrados = useMemo(() => {
    return productosBase.filter(p => {
      const pasaCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva;
      const terminoClean = busquedaTermino.toLowerCase().trim();
      const pasaBusqueda = p.nombre.toLowerCase().includes(terminoClean);
      return pasaCategoria && pasaBusqueda;
    });
  }, [productosBase, categoriaActiva, busquedaTermino]);

  // Regresar a la primera página automáticamente si cambia el filtro o el término de búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, busquedaTermino]);

  // --- LÓGICA DE PAGINACIÓN ---
  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    return productosFiltrados.slice(inicio, fin);
  }, [productosFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // --- LÓGICA DE CONSULTA DE REPARACIÓN ---
  const buscarEstado = async () => {
    if (!ordenBusqueda || !telBusqueda) {
      return setErrorBusqueda('Por favor, ingresá Nro de Orden y Teléfono.');
    }
    setCargando(true);
    setErrorBusqueda('');
    setEquipo(null);
    try {
      const nroOrdenClean = ordenBusqueda.trim();
      const telefonoClean = telBusqueda.trim();
      const idNumerico = Number(nroOrdenClean);

      if (isNaN(idNumerico)) {
        setErrorBusqueda('El número de orden debe ser válido.');
        setCargando(false);
        return;
      }

      const { data, error } = await supabase
        .from('ordenes')
        .select('nombre, equipo, estado_orden, falla, fecha')
        .eq('telefono', telefonoClean)
        .eq('id', idNumerico)
        .maybeSingle();

      if (error || !data) {
        setErrorBusqueda('No encontramos ninguna orden con esos datos.');
      } else {
        setEquipo(data as EquipoData);
      }
    } catch (err) {
      setErrorBusqueda('Error de conexión con el servidor.');
    }
    setCargando(false);
  };

  // --- LÓGICA DEL CARRITO CON CARTEL ---
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        return prev.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { producto, cantidad: 1 }];
    });

    setNotificacion("Producto añadido al carrito correctamente");
  };

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => {
        setNotificacion(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  const modificarCantidad = (id: number, delta: number) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.producto.id === id) {
          const nuevaCantidad = item.cantidad + delta;
          return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 0 };
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const finalizarCompraWhatsApp = () => {
    if (carrito.length === 0) return;
    let mensaje = `Hola ControlCel! Te paso mi pedido:\n\n`;
    carrito.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.producto.nombre} ($${(item.producto.precio * item.cantidad).toLocaleString('es-AR')})\n`;
    });
    mensaje += `\n*Total: $${totalCarrito.toLocaleString('es-AR')}*\n\n¿Tienen disponibilidad para armar el pedido?`;
    window.open(`https://wa.me/5492614603074?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const estiloTab = (idTab: 'todos' | 'celulares' | 'accesorios') => {
    const esActivo = categoriaActiva === idTab;
    return {
      padding: '10px 24px',
      borderRadius: '30px',
      border: `1px solid ${esActivo ? azulModerno : 'rgba(255,255,255,0.1)'}`,
      backgroundColor: esActivo ? azulModerno : 'rgba(0,0,0,0.4)',
      color: '#fff',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      fontSize: '0.85rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      transform: esActivo ? 'scale(1.05)' : 'scale(1)',
      boxShadow: esActivo ? `0 0 15px ${azulModerno}60` : 'none'
    };
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {/* FONDO AURORA */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora colorStops={["#3b82f6", "#7cff67", "#5227FF"]} amplitude={1} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* NAVBAR */}
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 5%', 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(20px)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          borderBottom: '1px solid rgba(255,255,255,0.08)', 
          height: '80px', 
          boxSizing: 'border-box' 
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setVista(vista === 'inicio' ? 'catalogo' : 'inicio')}
              style={{
                backgroundColor: vista === 'catalogo' ? azulModerno : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: `1px solid ${vista === 'catalogo' ? azulModerno : 'rgba(255,255,255,0.15)'}`,
                padding: '8px 18px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.8rem',
                cursor: 'pointer',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = vista === 'catalogo' ? azulModerno : 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = vista === 'catalogo' ? vista === 'catalogo' ? azulModerno : 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.05)'}
            >
              {vista === 'inicio' ? '📱 CATÁLOGO' : '🏠 INICIO'}
            </button>
          </div>

          <div onClick={() => setVista('inicio')} style={{ cursor: 'pointer', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <TrueFocus 
              sentence="CONTROL CEL" 
              blurAmount={5} 
              borderColor={azulModerno} 
              glowColor="rgba(59, 130, 246, 0.4)" 
              animationDuration={0.5} 
              pauseBetweenAnimations={1} 
            />
          </div>

          {/* BOTÓN CARRITO EN NAVBAR */}
          {vista === 'catalogo' && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setMostrarCarrito(true)}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#fff', 
                  padding: '10px 20px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <FaShoppingCart size={18} />
                <span style={{ fontWeight: 'bold' }}>Carrito</span>
              </button>
              {cantidadTotal > 0 && (
                <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                  {cantidadTotal}
                </div>
              )}
            </div>
          )}
          {vista === 'inicio' && <div style={{ width: '105px' }}></div>}
        </nav>

        {/* REDES SOCIALES FLOTANTES */}
        <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="https://instagram.com/control_cell_" target="_blank" rel="noreferrer" 
             style={{ 
               width: '55px', height: '55px', borderRadius: '50%', 
               backgroundColor: '#E1306C', color: '#fff', 
               display: 'flex', alignItems: 'center', justifyContent: 'center', 
               fontSize: '24px', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', 
               transition: '0.3s' 
             }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}>
            <FaInstagram />
          </a>

          <a href="https://tiktok.com/@control.cell" target="_blank" rel="noreferrer" 
             style={{ 
               width: '55px', height: '55px', borderRadius: '50%', 
               backgroundColor: '#000', color: '#fff', 
               display: 'flex', alignItems: 'center', justifyContent: 'center', 
               fontSize: '24px', border: '1px solid rgba(255,255,255,0.2)',
               boxShadow: '0 8px 25px rgba(0,0,0,0.4)', 
               transition: '0.3s' 
             }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}>
            <FaTiktok />
          </a>
        </div>

        {/* VISTAS CONDICIONALES */}
        {vista === 'inicio' ? (
          <>
            {/* HERO */}
            <section style={{ padding: '80px 5% 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* @ts-ignore */}
                <BlurText text="Servicio Técnico" delay={150} animateBy="words" direction="top" />
                {/* @ts-ignore */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <BlurText text="Especializado" delay={400} direction="bottom" animationFrom={{ filter: 'blur(10px)', opacity: 0, y: 50, color: "#ffffff" }} animationTo={[{ filter: 'blur(5px)', opacity: 0.5, y: -5 }, { filter: 'blur(0px)', opacity: 1, y: 0, color: azulModerno }]} />
                </div>
              </div>
              
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '4px', marginTop: '60px', marginBottom: '40px', opacity: 0.8, color: '#fff', textTransform: 'uppercase' }}>NUESTROS SERVICIOS</h2>

              {/* GRILLA DE SERVICIOS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', width: '100%', maxWidth: '1300px' }}>
                <ServiceItem title="Micro-soldadura" icon="🔬" desc="Reparaciones de alta complejidad en placa base bajo microscopio." />
                <ServiceItem title="Cambiamos tu Pantalla" icon="📱" desc="Pantallas originales con sellado de estanqueidad y garantía." />
                <ServiceItem title="Centros de Carga" icon="🔌" desc="Reemplazo de puertos con soldadura industrial de precisión." />
                <ServiceItem title="Baterías" icon="🔋" desc="Cambios certificados para recuperar la autonomía real de tu equipo." />
                <ServiceItem title="Software" icon="⚙️" desc="Flasheos, optimización de sistema y recuperación de datos." />
                <ServiceItem title="PC Service" icon="💻" desc="Mantenimiento de notebooks y PCs de escritorio, instalación de programas y optimización." />
              </div>
            </section>

            {/* FORMULARIOS */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
              {/* PRESUPUESTO ONLINE */}
              <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxSizing: 'border-box' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Presupuesto <span style={{ color: azulModerno }}>Online</span></h2>
                <form action="https://formspree.io/f/xdayokaj" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <input type="text" name="nombre" placeholder="Tu Nombre" required style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <input type="text" name="telefono" placeholder="WhatsApp" required style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <textarea name="falla" placeholder="Describí la falla de tu equipo..." required rows={4} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', resize: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}></textarea>
                  <button type="submit" style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${azulModerno}`} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>SOLICITAR PRESUPUESTO</button>
                </form>
              </div>

              {/* CONSULTA DE ESTADO */}
              <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: `1px solid rgba(255, 255, 255, 0.1)`, boxSizing: 'border-box' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Seguí tu <span style={{ color: azulModerno }}>Reparación</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                  <input type="text" placeholder="Nro de Orden" value={ordenBusqueda} onChange={(e) => setOrdenBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Teléfono" value={telBusqueda} onChange={(e) => setTelBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <button onClick={buscarEstado} style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${azulModerno}`} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>{cargando ? 'BUSCANDO...' : 'CONSULTAR ESTADO'}</button>
                
                {errorBusqueda && <p style={{ color: '#ff4b4b', textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>{errorBusqueda}</p>}
                
                {equipo && (
                  <div style={{ marginTop: '25px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center', padding: '15px', borderRadius: '15px', backgroundColor: equipo.estado_orden === 'Listo' ? '#10b981' : azulModerno, marginBottom: '15px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{equipo.estado_orden.toUpperCase()}</div>
                    </div>
                    <p style={{ textAlign: 'center', opacity: 0.8, fontSize: '0.9rem' }}>{equipo.equipo.toUpperCase()} - {equipo.falla}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* VISTA CATÁLOGO */
          <section style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', marginBottom: '30px', textAlign: 'center' }}>
              Catálogo de <span style={{ color: azulModerno }}>Artículos</span>
            </h2>

            {/* BUSCADOR */}
            <div style={{ maxWidth: '500px', margin: '0 auto 30px', padding: '0 10px' }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar por nombre (ej: iPhone, cargador...)" 
                value={busquedaTermino}
                onChange={(e) => setBusquedaTermino(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = azulModerno}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            {/* TABS DE FILTRADO */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <button onClick={() => setCategoriaActiva('todos')} style={estiloTab('todos')}>Todos</button>
              <button onClick={() => setCategoriaActiva('celulares')} style={estiloTab('celulares')}>📱 Celulares</button>
              <button onClick={() => setCategoriaActiva('accesorios')} style={estiloTab('accesorios')}>🔌 Accesorios</button>
            </div>

            {productosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.5, fontSize: '1.1rem', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '24px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                {busquedaTermino ? 'No se encontraron artículos que coincidan con tu búsqueda.' : 'No hay stock disponible en esta categoría en este momento.'}
              </div>
            ) : (
              <>
                {/* GRILLA CON PRODUCTOS PAGINADOS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '30px' }}>
                  {productosPaginados.map((p) => {
                    const isCardHovered = hoveredProductId === p.id;
                    return (
                      <div 
                        key={p.id} 
                        onMouseEnter={() => setHoveredProductId(p.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                          backdropFilter: 'blur(20px)', 
                          borderRadius: '24px', 
                          overflow: 'hidden', 
                          border: isCardHovered ? `1px solid ${azulModerno}` : '1px solid rgba(255,255,255,0.08)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'space-between', 
                          transform: isCardHovered ? 'scale(1.04) translateY(-5px)' : 'scale(1) translateY(0)',
                          boxShadow: isCardHovered ? `0 15px 30px rgba(59, 130, 246, 0.2)` : 'none',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                        }}
                      >
                        <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                          <img 
                            src={p.img} 
                            alt={p.nombre} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              transform: isCardHovered ? 'scale(1.08)' : 'scale(1)',
                              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }} 
                          />
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', height: '42px', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4', color: '#fff' }}>{p.nombre}</h4>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ color: azulModerno, fontWeight: '800', fontSize: '1.4rem' }}>${p.precio.toLocaleString('es-AR')}</span>
                            <button 
                              onClick={() => agregarAlCarrito(p)}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px', 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '12px', 
                                border: 'none', 
                                backgroundColor: azulModerno, 
                                color: '#fff', 
                                fontWeight: 'bold', 
                                cursor: 'pointer', 
                                fontSize: '0.85rem', 
                                transition: 'all 0.3s ease',
                                boxShadow: isCardHovered ? `0 4px 15px ${azulModerno}60` : 'none'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = azulModerno}
                            >
                              <FaShoppingCart size={16} /> AGREGAR AL CARRITO
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CONTROLES DE PAGINACIÓN */}
                {totalPaginas > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => {
                      const esActiva = paginaActual === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setPaginaActual(num)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: `1px solid ${esActiva ? azulModerno : 'rgba(255,255,255,0.1)'}`,
                            backgroundColor: esActiva ? azulModerno : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: esActiva ? `0 0 10px ${azulModerno}50` : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!esActiva) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            if (!esActiva) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* SECCIÓN UBICACIÓN */}
        <section style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', marginBottom: '60px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>¿Dónde <span style={{ color: azulModerno }}>estamos?</span></h2>
              <p style={{ margin: '10px 0' }}>📍 Salta 1161, Mendoza</p>
              <p style={{ opacity: 0.8 }}>⏰ Lun a Vie: 08:30 a 19:00 (Corrido)</p>
            </div>
            <div style={{ height: '300px', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.3475146950796!2d-68.8385311!3d-32.89025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09176378c909%3A0xf603f990924968!2sControl%20Cell!5e0!3m2!1ses-419!2sar!4v1713800000000" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Ubicación de ControlCel"
              ></iframe>
            </div>
          </div>
        </section>

        <WhatsAppChat />

        <footer style={{ textAlign: 'center', padding: '40px 5%', opacity: 0.4, fontSize: '0.8rem' }}>
          © 2026 ControlCel - Mendoza
        </footer>
      </div>

      {/* --- SIDEBAR DEL CARRITO --- */}
      {mostrarCarrito && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4000, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Overlay oscuro */}
          <div 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', cursor: 'pointer' }} 
            onClick={() => setMostrarCarrito(false)}
          ></div>
          
          {/* Panel del carrito */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '100%', backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', zIndex: 4001 }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaShoppingCart color={azulModerno} /> Mi Pedido
              </h3>
              <button 
                onClick={() => setMostrarCarrito(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {carrito.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
                  El carrito está vacío.
                </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span style={{ color: azulModerno }}>${totalCarrito.toLocaleString('es-AR')}</span>
                </div>
                <button 
                  onClick={finalizarCompraWhatsApp}
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#25d366', 
                    color: '#fff', 
                    padding: '16px', 
                    borderRadius: '15px', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '1rem', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20ba5a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25d366'}
                >
                  <FaWhatsapp size={20} /> FINALIZAR POR WHATSAPP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CARTEL FLOTANTE (TOAST NOTIFICACIÓN) --- */}
      {notificacion && (
        <div style={{
          position: 'fixed',
          top: '95px',
          right: '25px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(15px)',
          border: `1px solid ${azulModerno}`,
          borderRadius: '16px',
          padding: '12px 24px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 5000,
          boxShadow: `0 10px 25px rgba(59, 130, 246, 0.25)`,
          animation: 'fadeIn 0.3s ease-out',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          <FaCheckCircle color="#10b981" size={18} />
          {notificacion}
        </div>
      )}

    </div>
  );
}