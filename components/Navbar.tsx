"use client";

import React from 'react';
import Image from 'next/image';
import TrueFocus from '../components/TrueFocus'; // <--- IMPORTAMOS EL COMPONENTE

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  
  // Estilo base para los botones
  const navButtonStyle = (tabName: string): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: activeTab === tabName ? '#ebf8ff' : 'transparent',
    color: activeTab === tabName ? '#3182ce' : '#718096',
  });

  return (
    <header style={headerStyle}>
      {/* LADO IZQUIERDO: LOGO Y NOMBRE CON TRUE FOCUS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TrueFocus 
          sentence="Control Cell"
          blurAmount={3}
          borderColor="#3182ce" // Usamos el azul de tu sistema de gestión
          glowColor="rgba(49, 130, 206, 0.4)"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />
      </div>

      {/* CENTRO/DERECHA: NAVEGACIÓN (Lógica intacta) */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setActiveTab('servicio')} 
          style={navButtonStyle('servicio')}
        >
          🛠️ Servicio
        </button>
        
        <button 
          onClick={() => setActiveTab('ordenes')} 
          style={navButtonStyle('ordenes')}
        >
          📋 Órdenes
        </button>

        <button 
          onClick={() => setActiveTab('stock')} 
          style={navButtonStyle('stock')}
        >
          📦 Stock
        </button>

        <button 
          onClick={() => setActiveTab('ventas')} 
          style={navButtonStyle('ventas')}
        >
          💰 Ventas
        </button>
      </nav>

      {/* LADO DERECHO: UBICACIÓN */}
      <div style={{ fontSize: '0.75rem', color: '#a0aec0', textAlign: 'right', fontWeight: '500' }}>
        Mendoza, AR<br/>
        <span style={{ color: '#3182ce' }}>Salta 1161</span>
      </div>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 40px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};