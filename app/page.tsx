"use client";

import React, { useState } from 'react';
import Aurora from '../components/Aurora'; 
import ElectricBorder from '../components/ElectricBorder'; 
import TrueFocus from '../components/TrueFocus';
import BlurText from '../components/BlurText'; 
import { supabase } from '../lib/supabase';
import WhatsAppChat from '../components/WhatsAppChat';
// @ts-ignore
import { FaInstagram, FaTiktok } from 'react-icons/fa';

// --- INTERFACES ---
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

// --- COMPONENTE DE SERVICIOS ---
const ServiceItem = ({ title, icon, desc }: ServiceItemProps) => {
  return (
    /* @ts-ignore */
    <ElectricBorder color="#7df9ff" speed={1} chaos={0.12} style={{ borderRadius: '32px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '30px', textAlign: 'center', height: '100%' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
        <h3 style={{ fontWeight: '800', marginBottom: '10px' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{desc}</p>
      </div>
    </ElectricBorder>
  );
};

export default function WebControlCell() {
  const azulModerno = "#3b82f6";

  const [ordenBusqueda, setOrdenBusqueda] = useState('');
  const [telBusqueda, setTelBusqueda] = useState('');
  const [equipo, setEquipo] = useState<EquipoData | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const buscarEstado = async () => {
    if (!ordenBusqueda || !telBusqueda) {
      return setErrorBusqueda('Por favor, ingresá Nro de Orden y Teléfono.');
    }
    setCargando(true);
    setErrorBusqueda('');
    try {
      const { data, error } = await supabase
        .from('ordenes')
        .select('nombre, equipo, estado_orden, falla, fecha')
        .eq('telefono', telBusqueda)
        .ilike('id', `%${ordenBusqueda}%`)
        .maybeSingle();
      if (error || !data) {
        setErrorBusqueda('No encontramos ninguna orden.');
        setEquipo(null);
      } else {
        setEquipo(data as EquipoData);
      }
    } catch (err) {
      setErrorBusqueda('Error de conexión.');
    }
    setCargando(false);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {/* FONDO AURORA */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora colorStops={["#7cff67", "#B19EEF", "#5227FF"]} amplitude={1} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* NAVBAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(15px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)', height: '80px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrueFocus sentence="CONTROL CEL" blurAmount={5} borderColor={azulModerno} glowColor="rgba(59, 130, 246, 0.6)" animationDuration={0.5} pauseBetweenAnimations={1} />
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="https://instagram.com/control_cell_" target="_blank" rel="noreferrer" style={{ opacity: 0.9, color: '#fff', fontSize: '1.7rem', transition: '0.3s' }}>
              <FaInstagram />
            </a>
            <a href="https://tiktok.com/@control.cell" target="_blank" rel="noreferrer" style={{ opacity: 0.9, color: '#fff', fontSize: '1.7rem', transition: '0.3s' }}>
              <FaTiktok />
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 5% 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.1' }}>
            {/* @ts-ignore */}
            <BlurText text="Servicio Técnico" delay={150} animateBy="words" direction="top" />
            {/* @ts-ignore */}
            <BlurText 
              text="Especializado" 
              delay={400} 
              direction="bottom" 
              animationFrom={{ filter: 'blur(10px)', opacity: 0, y: 50, color: "#ffffff" }}
              animationTo={[
                { filter: 'blur(5px)', opacity: 0.5, y: -5 },
                { filter: 'blur(0px)', opacity: 1, y: 0, color: azulModerno }
              ]}
            />
          </div>
        </section>

        {/* SERVICIOS */}
        <section style={{ padding: '40px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <ServiceItem title="Micro-soldadura" icon="🔬" desc="Reparaciones de alta complejidad en placa." />
          <ServiceItem title="Módulos" icon="📱" desc="Pantallas originales y OLED con garantía." />
          <ServiceItem title="Pines de Carga" icon="🔌" desc="Reparación de puertos y conectores." />
          <ServiceItem title="Baterías" icon="🔋" desc="Cambios certificados con máxima vida útil." />
          <ServiceItem title="Software" icon="⚙️" desc="Flasheos, cuentas y optimización de sistema." />
          <ServiceItem title="PC Service" icon="💻" desc="Mantenimiento de notebooks y computadoras." />
        </section>

        {/* CONTENEDOR DE FORMULARIOS CENTRADOS Y RESPONSIVOS */}
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
              <button type="submit" style={{ backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>Solicitar Presupuesto</button>
            </form>
          </div>

          {/* CONSULTA DE ESTADO */}
          <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: `1px solid ${azulModerno}`, boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Seguí tu <span style={{ color: azulModerno }}>Reparación</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <input type="text" placeholder="Nro de Orden" value={ordenBusqueda} onChange={(e) => setOrdenBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Teléfono" value={telBusqueda} onChange={(e) => setTelBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <button onClick={buscarEstado} style={{ width: '100%', padding: '18px', borderRadius: '15px', backgroundColor: '#fff', color: '#000', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>{cargando ? 'BUSCANDO...' : 'CONSULTAR ESTADO'}</button>
            
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

        {/* SECCIÓN FINAL CON MAPA */}
        <section style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', marginBottom: '60px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900' }}>¿Dónde <span style={{ color: azulModerno }}>estamos?</span></h2>
              <p style={{ margin: '10px 0' }}>📍 Salta 1161, Mendoza</p>
              <p style={{ opacity: 0.8 }}>⏰ Lun a Vie: 08:30 a 19:00 (Corrido)</p>
            </div>
            <div style={{ height: '300px', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.231268305332!2d-68.836724024222!3d-32.89040882412803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09a0ba2231f9%3A0x8a8aee556596e8e9!2sControlCell!5e0!3m2!1ses-419!2sar!4v1713374000000!5m2!1ses-419!2sar" 
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