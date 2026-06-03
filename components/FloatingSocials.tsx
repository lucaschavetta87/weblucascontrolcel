"use client";
import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

export default function FloatingSocials() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1) translateY(0)';
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <a href="https://instagram.com/control_cell_" target="_blank" rel="noreferrer" 
         style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#E1306C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', transition: '0.3s' }}
         onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <FaInstagram />
      </a>

      <a href="https://tiktok.com/@control.cell" target="_blank" rel="noreferrer" 
         style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', transition: '0.3s' }}
         onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <FaTiktok />
      </a>
    </div>
  );
}