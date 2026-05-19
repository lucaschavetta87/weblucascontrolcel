"use client";
import React, { useState } from 'react';

// --- ICONO OFICIAL DE WHATSAPP (SVG) ---
const IconoWhatsApp = () => (
  <svg width="30" height="30" viewBox="0 0 448 512" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const colorWA = "#25D366";
  const azulModerno = "#3b82f6";
  const colorFondoChat = "#0b141a"; // El oscuro real de WhatsApp Web

  const opciones = [
    { label: "🔬 Consultar presupuesto", msg: "Hola! Quisiera solicitar un presupuesto para mi equipo." },
    { label: "📱 Estado de mi reparación", msg: "Hola! Quisiera saber el estado de mi orden de servicio." },
    { label: "📦 Venta de repuestos/equipos", msg: "Hola! Estoy interesado en comprar repuestos o equipos." },
  ];

  const irAWhatsApp = (mensaje: string) => {
    const nro = "5492614603074";
    const url = `https://wa.me/${nro}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000, fontFamily: 'sans-serif' }}>
      
      {isOpen && (
        <div style={{ position: 'absolute', bottom: '80px', right: '0', width: '320px', backgroundColor: colorFondoChat, borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ backgroundColor: '#075e54', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '55px', height: '55px', backgroundColor: '#fff', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', fontWeight: '900', color: '#075e54', border: '2px solid #25D366' }}>CC</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>ControlCel Mendoza</div>
            <div style={{ fontSize: '0.85rem', color: '#e0e0e0', marginTop: '4px' }}>Técnicos siempre online 🟢</div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#111b21' }}>
            {opciones.map((opt, i) => (
              <button key={i} onClick={() => irAWhatsApp(opt.msg)} style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#202c33', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', transition: '0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a3942'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#202c33'}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: isOpen ? '#333' : colorWA, width: '65px', height: '65px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', cursor: 'pointer', border: 'none', transition: '0.3s', position: 'relative' }} className={!isOpen ? "pulse-button" : ""}>
        {isOpen ? <span style={{ fontSize: '24px', color: '#fff' }}>✕</span> : <IconoWhatsApp />}
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-button::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #25D366;
          opacity: 0.7;
          animation: pulse 2s infinite;
          z-index: -1;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}