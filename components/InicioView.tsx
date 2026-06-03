"use client";
import React, { useState } from 'react';
import BlurText from './BlurText';
import ServiceItem from './ServiceItem';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';

interface EquipoData {
  nombre: string;
  equipo: string;
  estado_orden: string;
  falla: string;
  fecha: string;
}

interface InicioViewProps {
  ordenBusqueda: string;
  setOrdenBusqueda: (v: string) => void;
  telBusqueda: string;
  setTelBusqueda: (v: string) => void;
  buscarEstado: () => void;
  cargando: boolean;
  errorBusqueda: string;
  equipo: EquipoData | null;
  azulModerno: string;
}

export default function InicioView({ 
  ordenBusqueda, setOrdenBusqueda, telBusqueda, setTelBusqueda, 
  buscarEstado, cargando, errorBusqueda, equipo, azulModerno 
}: InicioViewProps) {
  
  // Estado para las FAQs (guarda el índice de la pregunta abierta, o null)
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  // Estado para el selector de fallas comunes
  const [fallaSeleccionada, setFallaSeleccionada] = useState('');

  const toggleFaq = (index: number) => {
    setFaqAbierta(faqAbierta === index ? null : index);
  };

  const listaFaqs = [
    { q: "¿Cuánto demoran en reparar mi equipo?", a: "La mayoría de los cambios de pantalla, baterías y pines de carga se realizan en el día (de 2 a 4 horas) según disponibilidad de stock. Las reparaciones de micro-soldadura en placa base pueden demorar entre 24 y 72 horas." },
    { q: "¿Las reparaciones tienen garantía?", a: "Sí, absolutamente. Todos nuestros trabajos técnicos y componentes instalados cuentan con garantía escrita oficial de ControlCel. La misma cubre cualquier defecto de fabricación del repuesto." },
    { q: "¿Qué métodos de pago reciben en el local?", a: "Aceptamos efectivo, transferencias bancarias, Mercado Pago y tarjetas de crédito o débito. Consultanos por WhatsApp por promociones vigentes o cuotas." },
    { q: "¿Tengo que sacar turno previo para llevarlo?", a: "No es necesario. Atendemos por orden de llegada en nuestro local de Salta 1161, Mendoza, de Lunes a Viernes en horario corrido de 08:30 a 19:00 hs." }
  ];

  return (
    <>
      {/* SECCIÓN HERO Y SERVICIOS */}
      <section style={{ padding: '100px 5% 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* @ts-ignore */}
          <BlurText text="Servicio Técnico" delay={150} animateBy="words" direction="top" />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {/* @ts-ignore */}
            <BlurText text="Especializado" delay={400} direction="bottom" animationFrom={{ filter: 'blur(10px)', opacity: 0, y: 50, color: "#ffffff" }} animationTo={[{ filter: 'blur(5px)', opacity: 0.5, y: -5 }, { filter: 'blur(0px)', opacity: 1, y: 0, color: azulModerno }]} />
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '4px', marginTop: '60px', marginBottom: '40px', opacity: 0.8, color: '#fff', textTransform: 'uppercase' }}>NUESTROS SERVICIOS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', width: '100%', maxWidth: '1300px' }}>
          <ServiceItem title="Micro-soldadura" icon="🔬" desc="Reparaciones de alta complejidad en placa base bajo microscopio." />
          <ServiceItem title="Cambiamos tu Pantalla" icon="📱" desc="Pantallas originales con sellado de estanqueidad y garantía." />
          <ServiceItem title="Centros de Carga" icon="🔌" desc="Reemplazo de puertos con soldadura industrial de precisión." />
          <ServiceItem title="Baterías" icon="🔋" desc="Cambios certificados para recuperar la autonomía real de tu equipo." />
          <ServiceItem title="Software" icon="⚙️" desc="Flasheos, optimización de sistema y recuperación de datos." />
          <ServiceItem title="PC Service" icon="💻" desc="Mantenimiento de notebooks y PCs de escritorio, instalación de programas y optimización." />
        </div>
      </section>

      {/* COMPORTAMIENTO PARA FORMULARIOS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* IMPROVEMENT 2: PRESUPUESTO ONLINE CON SELECTOR DE FALLAS */}
        <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Presupuesto <span style={{ color: azulModerno }}>Online</span></h2>
          <form action="https://formspree.io/f/xdayokaj" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <input type="text" name="nombre" placeholder="Tu Nombre" required style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              <input type="text" name="telefono" inputMode="tel" placeholder="WhatsApp" required style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            </div>

            {/* Selector de fallas inteligente */}
            <select 
              name="tipo_falla" 
              value={fallaSeleccionada}
              onChange={(e) => setFallaSeleccionada(e.target.value)}
              required
              style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
            >
              <option value="" disabled style={{ background: '#0f172a' }}>¿Qué le pasa a tu equipo? (Seleccioná una opción)</option>
              <option value="Pantalla rota / sin imagen" style={{ background: '#0f172a' }}>📱 Pantalla rota / No da imagen</option>
              <option value="No carga / Pin roto" style={{ background: '#0f172a' }}>🔌 No carga / Pin de carga roto</option>
              <option value="Batería dura poco / hinchada" style={{ background: '#0f172a' }}>🔋 La batería dura poco o se apaga solo</option>
              <option value="Se mojó / No prende" style={{ background: '#0f172a' }}>💧 Se mojó / No enciende</option>
              <option value="Falla de Software o cuenta" style={{ background: '#0f172a' }}>⚙️ Falla de sistema / Limpieza de Software</option>
              <option value="Mantenimiento de PC/Notebook" style={{ background: '#0f172a' }}>💻 Service / Optimización de PC o Notebook</option>
              <option value="otra" style={{ background: '#0f172a' }}>✏️ Otra falla (Describir abajo)</option>
            </select>

            {/* Cuadro de texto condicional o descriptivo */}
            {(fallaSeleccionada === 'otra' || fallaSeleccionada !== '') && (
              <textarea 
                name="falla_detalle" 
                placeholder={fallaSeleccionada === 'otra' ? "Describí detalladamente la falla acá..." : "Algún detalle extra? (Modelo del equipo, marca, etc. Opcional)"} 
                required={fallaSeleccionada === 'otra'}
                rows={3} 
                style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', resize: 'none', outline: 'none', width: '100%', boxSizing: 'border-box', animation: 'fadeIn 0.2s ease-out' }}
              ></textarea>
            )}

            <button type="submit" style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem', transition: 'all 0.3s' }}>SOLICITAR PRESUPUESTO</button>
          </form>
        </div>

        {/* SEGUIMIENTO DE REPARACIÓN */}
        <div style={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: 'clamp(20px, 5vw, 40px)', border: `1px solid rgba(255, 255, 255, 0.1)`, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Seguí tu <span style={{ color: azulModerno }}>Reparación</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
            <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Nro de Orden" value={ordenBusqueda} onChange={(e) => setOrdenBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <input type="text" inputMode="tel" placeholder="Teléfono" value={telBusqueda} onChange={(e) => setTelBusqueda(e.target.value)} style={{ padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button onClick={buscarEstado} style={{ width: '100%', backgroundColor: azulModerno, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '1rem', transition: 'all 0.3s' }}>{cargando ? 'BUSCANDO...' : 'CONSULTAR ESTADO'}</button>
          
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

        {/* IMPROVEMENT 1: ACORDEÓN DE PREGUNTAS FRECUENTES (FAQs) */}
        <div style={{ width: '100%', maxWidth: '700px', marginTop: '20px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>Preguntas <span style={{ color: azulModerno }}>Frecuentes</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {listaFaqs.map((faq, idx) => {
              const isOpen = faqAbierta === idx;
              return (
                <div 
                  key={idx} 
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s' }}
                >
                  <button 
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <FaChevronUp color={azulModerno} /> : <FaChevronDown opacity={0.5} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px 20px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.5', animation: 'fadeIn 0.2s ease-out' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}