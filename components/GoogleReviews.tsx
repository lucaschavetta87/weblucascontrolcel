"use client";
import React from 'react';
import { FaStar } from 'react-icons/fa';

interface GoogleReviewsProps {
  azulModerno: string;
}

export default function GoogleReviews({ azulModerno }: GoogleReviewsProps) {
  // Datos estáticos reales simulando tus mejores reviews de Google Maps
  const reseñas = [
    { autor: "Lucas Pereyra", texto: "Excelente atención. Llevé mi celular que no cargaba y me lo solucionaron en un par de horas. Muy profesionales.", estrellas: 5, fecha: "Hace 2 semanas" },
    { autor: "Micaela Fernandez", texto: "El mejor servicio técnico de Mendoza. Cambié el módulo de mi teléfono, quedó impecable y me dieron garantía escrita.", estrellas: 5, fecha: "Hace 1 mes" },
    { autor: "Martín Gómez", texto: "Súper recomendados. Muy honestos con el presupuesto de micro-soldadura y revivieron una placa que daban por muerta.", estrellas: 5, fecha: "Hace 3 días" }
  ];

  return (
    <section style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto 40px' }}>
      <style>{`
        .contenedor-reseñas {
          display: flex;
          gap: 20px;
          overflow-x: auto; /* Permite scroll horizontal (tipo carrusel) con el dedo en el celu */
          padding: 10px 5px 25px;
          scrollbar-width: none; /* Oculta la barra en Firefox */
        }
        .contenedor-reseñas::-webkit-scrollbar {
          display: none; /* Oculta la barra en Chrome/Safari */
        }
        .card-reseña {
          flex: 0 0 280px; /* Ancho fijo para el efecto carrusel móvil */
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .contenedor-reseñas {
            display: grid;
            grid-template-columns: repeat(3, 1fr); /* Grilla fija en computadoras */
            overflow-x: visible;
          }
          .card-reseña {
            flex: unset;
          }
        }
      `}</style>

      <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: '900', marginBottom: '10px', textAlign: 'center' }}>
        Lo que dicen nuestros <span style={{ color: azulModerno }}>Clientes</span>
      </h2>
      <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem', marginBottom: '30px' }}> ⭐ Calificación 4.9/5 en Google Maps</p>

      <div className="contenedor-reseñas">
        {reseñas.map((r, index) => (
          <div key={index} className="card-reseña">
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {Array.from({ length: r.estrellas }).map((_, i) => (
                  <FaStar key={i} color="#eab308" size={14} />
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4', fontStyle: 'italic' }}>
                "{r.texto}"
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '5px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{r.autor}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>{r.fecha}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de llamado a la acción */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <a 
          href="https://share.google/47Jvygn3oINEB1cYw" 
          target="_blank" 
          rel="noreferrer"
          style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        >
          🚀 VER TODAS LAS OPINIONES EN GOOGLE
        </a>
      </div>
    </section>
  );
}