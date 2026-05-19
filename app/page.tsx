"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Aurora from '../components/Aurora'; 
import ElectricBorder from '../components/ElectricBorder'; 
import TrueFocus from '../components/TrueFocus';
import BlurText from '../components/BlurText'; 
import { supabase } from '../lib/supabase';
import WhatsAppChat from '../components/WhatsAppChat';
// @ts-ignore
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

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

// --- COMPONENTE DE SERVICIOS PULIDO ---
const ServiceItem = ({ title, icon, desc }: ServiceItemProps) => {
  return (
    /* @ts-ignore */
    <ElectricBorder color="#3b82f6" speed={1} chaos={0.12} style={{ borderRadius: '32px' }}>
      <div 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
          padding: '30px', 
          borderRadius: '30px', 
          textAlign: 'center', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ 
          fontSize: '2.5rem', 
          backgroundColor: 'rgba(59, 130, 246, 0.15)', 
          width: '70px', 
          height: '70px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRadius: '18px',
          margin: '0 auto 10px'
        }}>{icon}</div>
        <h3 style={{ fontWeight: '800', fontSize: '1.2rem', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: '1.5', margin: 0 }}>{desc}</p>
      </div>
    </ElectricBorder>
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

  // --- NUEVOS ESTADOS DE CONTROL DE CATÁLOGO ---
  const [vista, setVista] = useState<'inicio' | 'catalogo'>('inicio');
  const [productosBase, setProductosBase] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<'todos' | 'celulares' | 'accesorios'>('todos');

  // --- CONEXIÓN Y CARGA DE STOCK DESDE SUPABASE ---
  const cargarProductosNube = async () => {
    try {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .gt('cantidad', 0) // Trae solo repuestos o artículos con stock disponible físico
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

  // --- FILTRADO FILTRADO DINÁMICO ---
  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todos') return productosBase;
    return productosBase.filter(p => p.categoria === categoriaActiva);
  }, [productosBase, categoriaActiva]);

  // --- LOGICA ORIGINAL DE CONSULTA DE REPARACIÓN CORREGIDA ---
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

  const enviarWhatsAppCatalogo = (nombreProd: string, precioProd: number) => {
    const mensaje = `Hola ControlCel! Me interesa consultar por el artículo: *${nombreProd}* publicado a *$${precioProd.toLocaleString('es-AR')}*. ¿Tienen disponibilidad?`;
    window.open(`https://wa.me/5492614603074?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const estiloTab = (idTab: 'todos' | 'celulares' | 'accesorios') => ({
    padding: '10px 24px',
    borderRadius: '30px',
    border: `1px solid ${categoriaActiva === idTab ? azulModerno : 'rgba(255,255,255,0.1)'}`,
    backgroundColor: categoriaActiva === idTab ? azulModerno : 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {/* FONDO AURORA */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora colorStops={["#3b82f6", "#7cff67", "#5227FF"]} amplitude={1} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* NAVBAR MODIFICADO CON SUBMENÚ A LA IZQUIERDA DEL LOGO */}
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
          {/* SUBMENU ARRIBA A LA IZQUIERDA DEL NOMBRE */}
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
                transition: 'all 0.3s'
              }}
            >
              {vista === 'inicio' ? '📱 CATÁLOGO' : '🏠 INICIO'}
            </button>
          </div>

          <div onClick={() => setVista('inicio')} style={{ cursor: 'pointer' }}>
            <TrueFocus 
              sentence="CONTROL CEL" 
              blurAmount={5} 
              borderColor={azulModerno} 
              glowColor="rgba(59, 130, 246, 0.4)" 
              animationDuration={0.5} 
              pauseBetweenAnimations={1} 
            />
          </div>
          
          {/* Espaciador derecho invisible para balancear simetría del TrueFocus */}
          <div style={{ width: '105px', display: 'none' }}></div>
        </nav>

        {/* REDES SOCIALES FLOTANTES (IZQUIERDA) */}
        <div style={{ 
          position: 'fixed', 
          bottom: '30px', 
          left: '30px', 
          zIndex: 3000, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}>
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

        {/* CONTENIDO INTERMITENTE DEPENDIENDO DE LA VISTA SELECCIONADA */}
        {vista === 'inicio' ? (
          <>
            {/* HERO ORIGINAL */}
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

              {/* GRILLA DE SERVICIOS PULIDA ORIGINAL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', width: '100%', maxWidth: '1200px' }}>
                <ServiceItem title="Micro-soldadura" icon="🔬" desc="Reparaciones de alta complejidad en placa base bajo microscopio." />
                <ServiceItem title="Cambiamos tu Pantalla" icon="📱" desc="Pantallas originales con sellado de estanqueidad y garantía." />
                <ServiceItem title="Centros de Carga" icon="🔌" desc="Reemplazo de puertos con soldadura industrial de precisión." />
                <ServiceItem title="Baterías" icon="🔋" desc="Cambios certificados para recuperar la autonomía real de tu equipo." />
                <ServiceItem title="Software" icon="⚙️" desc="Flasheos, optimización de sistema y recuperación de datos." />
                <ServiceItem title="PC Service" icon="💻" desc="Mantenimiento avanzado de notebooks y computadoras de escritorio, instalacion de programas y optimizacion." />
                <ServiceItem title="Reballing/IC" icon="🔧" desc="Tratamiento térmico y soldadura de integrados para fallas críticas." />
                <ServiceItem title="Ecosistema Apple" icon="🍏" desc="Restauración y optimización de hardware/software de iMac y MacBook." />
              </div>
            </section>

            {/* CONTENEDOR DE FORMULARIOS ORIGINAL */}
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
                  <button type="submit" style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>SOLICITAR PRESUPUESTO</button>
                </form>
              </div>

              {/* CONSULTA DE ESTADO */}
              <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: `1px solid rgba(255, 255, 255, 0.1)`, boxSizing: 'border-box' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Seguí tu <span style={{ color: azulModerno }}>Reparación</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                  <input type="text" placeholder="Nro de Orden" value={ordenBusqueda} onChange={(e) => setOrdenBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Teléfono" value={telBusqueda} onChange={(e) => setTelBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <button onClick={buscarEstado} style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>{cargando ? 'BUSCANDO...' : 'CONSULTAR ESTADO'}</button>
                
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
          /* NUEVA SECCIÓN DE VITRINA MULTIMEDIA COMPATIBLE */
          <section style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto', animation: 'fadeInUp 0.4s ease' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', marginBottom: '30px', textAlign: 'center' }}>
              Catálogo de <span style={{ color: azulModerno }}>Artículos</span>
            </h2>

            {/* TABS DE FILTRADO */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <button onClick={() => setCategoriaActiva('todos')} style={estiloTab('todos')}>Todos</button>
              <button onClick={() => setCategoriaActiva('celulares')} style={estiloTab('celulares')}>📱 Celulares</button>
              <button onClick={() => setCategoriaActiva('accesorios')} style={estiloTab('accesorios')}>🔌 Accesorios</button>
            </div>

            {productosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.5, fontSize: '1.1rem', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '24px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                No hay stock disponible en esta categoría en este momento.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '30px' }}>
                {productosFiltrados.map((p) => (
                  <div key={p.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s' }}>
                    <img src={p.img} alt={p.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', height: '42px', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }}>{p.nombre}</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ color: azulModerno, fontWeight: '800', fontSize: '1.4rem' }}>${p.precio.toLocaleString('es-AR')}</span>
                        <button 
                          onClick={() => enviarWhatsAppCatalogo(p.nombre, p.precio)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#25d366', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s' }}
                        >
                          <FaWhatsapp size={16} /> CONSULTAR STOCK
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECCIÓN FINAL CON MAPA ORIGINAL */}
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
    </div>
  );
}