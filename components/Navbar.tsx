"use client";
import React from 'react';
import TrueFocus from './TrueFocus';
import { FaShoppingCart } from 'react-icons/fa';

interface NavbarProps {
  vista: 'inicio' | 'catalogo';
  setVista: (vista: 'inicio' | 'catalogo') => void;
  cantidadTotal: number;
  setMostrarCarrito: (mostrar: boolean) => void;
  azulModerno: string;
}

export default function Navbar({ vista, setVista, cantidadTotal, setMostrarCarrito, azulModerno }: NavbarProps) {
  return (
    <>
      <style>{`
        .public-nav {
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 0 5%; 
          background-color: rgba(0,0,0,0.6); 
          backdrop-filter: blur(20px); 
          
          /* --- CAMBIO CLAVE: Volverlo fijo flotante sobre toda la web --- */
          position: fixed; 
          top: 0; 
          left: 0;
          width: 100%;
          
          z-index: 100; 
          border-bottom: 1px solid rgba(255,255,255,0.08); 
          height: 80px; 
          box-sizing: border-box;
        }
        
        .logo-nav-left { 
          display: flex; 
          align-items: center; 
          cursor: pointer; 
          height: 100%;
        }

        .logo-nav-left span, 
        .logo-nav-left div {
          font-size: 1.35rem !important; 
          font-weight: 900 !important;
        }
        
        .nav-right-container { 
          display: flex; 
          align-items: center; 
          justify-content: flex-end;
        }
        
        .btn-nav-publica { background-color: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; cursor: pointer; letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.3s ease; }
        .btn-nav-publica:hover { background-color: rgba(255,255,255,0.12); }
        
        .btn-carrito-publico { background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; border-radius: 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.3s; position: relative; }
        .btn-carrito-publico:hover { background-color: rgba(255,255,255,0.2); }
        
        @media (max-width: 480px) {
          .public-nav { height: 70px !important; padding: 0 4% !important; }
          .logo-nav-left span, 
          .logo-nav-left div { 
            font-size: 1.05rem !important; 
          }
          .btn-nav-publica { padding: 7px 12px !important; font-size: 0.75rem !important; letter-spacing: 0.8px !important; }
          .btn-carrito-publico { padding: 7px 12px !important; font-size: 0.75rem !important; gap: 6px !important; }
        }
      `}</style>

      <nav className="public-nav">
        <div className="logo-nav-left" onClick={() => setVista('inicio')}>
          <TrueFocus 
            sentence="CONTROL CEL" 
            blurAmount={5} 
            borderColor={azulModerno} 
            glowColor="rgba(59, 130, 246, 0.4)" 
            animationDuration={0.5} 
            pauseBetweenAnimations={1} 
          />
        </div>

        <div className="nav-right-container">
          {vista === 'inicio' ? (
            <button className="btn-nav-publica" onClick={() => setVista('catalogo')}>
              📱 CATÁLOGO
            </button>
          ) : (
            <button className="btn-carrito-publico" onClick={() => setMostrarCarrito(true)}>
              <FaShoppingCart size={16} />
              <span style={{ fontWeight: 'bold' }}>Carrito</span>
              {cantidadTotal > 0 && (
                <div style={{ 
                  position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', 
                  color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', 
                  height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', 
                  alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' 
                }}>
                  {cantidadTotal}
                </div>
              )}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}