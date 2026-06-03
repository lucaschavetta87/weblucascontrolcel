"use client";
import React, { useState } from 'react';
import ElectricBorder from './ElectricBorder'; // Ajustá la ruta según dónde esté tu componente original

interface ServiceItemProps {
  title: string;
  icon: string;
  desc: string;
}

export default function ServiceItem({ title, icon, desc }: ServiceItemProps) {
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
}