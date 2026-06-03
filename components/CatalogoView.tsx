"use client";
import React, { useState } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  img: string;
  categoria: string;
}
interface CatalogoViewProps {
  productosFiltrados: Producto[];
  productosPaginados: Producto[];
  busquedaTermino: string;
  setBusquedaTermino: (v: string) => void;
  categoriaActiva: 'todos' | 'celulares' | 'accesorios';
  setCategoriaActiva: (cat: 'todos' | 'celulares' | 'accesorios') => void;
  paginaActual: number;
  setPaginaActual: (pag: number) => void;
  totalPaginas: number;
  agregarAlCarrito: (p: Producto) => void;
  cantidadTotal: number;
  setMostrarCarrito: (mostrar: boolean) => void;
  azulModerno: string;
  estiloTab: (idTab: 'todos' | 'celulares' | 'accesorios') => React.CSSProperties;
}

export default function CatalogoView({ 
  productosFiltrados, productosPaginados, busquedaTermino, setBusquedaTermino, 
  categoriaActiva, setCategoriaActiva, paginaActual, setPaginaActual, totalPaginas, 
  agregarAlCarrito, cantidadTotal, setMostrarCarrito, azulModerno, estiloTab 
}: CatalogoViewProps) {
  
  // Estado para controlar qué producto se está mirando en grande (Zoom/Modal)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  return (
    <section style={{ padding: '100px 4% 100px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ESTILOS EXCLUSIVOS PARA RESPONSIVE Y MOBILE */}
      <style>{`
        .grid-productos {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 25px;
        }
        .card-producto {
          background-color: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease-in-out;
        }

        /* --- MEJORA PC: Contorno iluminado azul y zoom leve a la imagen al pasar el mouse --- */
        @media (min-width: 481px) {
          .card-producto:hover {
            border-color: ${azulModerno} !important;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
            transform: translateY(-4px);
          }
          .card-producto:hover .img-catalogo {
            transform: scale(1.06);
          }
        }

        .img-contenedor-mobile {
          width: 100%; 
          height: 180px; 
          overflow: hidden;
          cursor: pointer; /* Indica que se puede clickear/tocar */
        }

        .img-catalogo {
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.3s ease-in-out;
        }

        .btn-agregar-carrito {
          display: flex; alignItems: center; justifyContent: center; gap: 6px;
          width: 100%; padding: 12px; border-radius: 12px; border: none;
          background-color: ${azulModerno}; color: #fff; font-weight: bold;
          cursor: pointer; fontSize: 0.8rem;
        }
        .btn-agregar-carrito:active {
          transform: scale(0.95);
          background-color: #2563eb;
        }

        /* ----- MEDIA QUERY: OPTIMIZACIÓN EXCLUSIVA CELULARES ----- */
        @media (max-width: 480px) {
          .grid-productos {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .card-producto {
            border-radius: 16px !important;
          }
          .img-contenedor-mobile {
            height: 140px !important;
          }
          .card-title-mobile {
            font-size: 0.85rem !important;
            height: 36px !important;
            line-height: 1.2 !important;
          }
          .card-precio-mobile {
            font-size: 1.15rem !important;
          }
          .btn-agregar-carrito {
            padding: 10px 4px !important;
            font-size: 0.7rem !important;
            letter-spacing: -0.2px;
          }
        }

        /* Botón flotante para el pulgar */
        .btn-flotante-carrito {
          position: fixed;
          bottom: 30px;
          right: 25px;
          background-color: #25d366;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          z-index: 2900;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>

      <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>
        Catálogo de <span style={{ color: azulModerno }}>Artículos</span>
      </h2>

      {/* BUSCADOR */}
      <div style={{ maxWidth: '500px', margin: '0 auto 25px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar..." 
          value={busquedaTermino}
          onChange={(e) => setBusquedaTermino(e.target.value)}
          style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* TABS DE FILTRADO */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setCategoriaActiva('todos')} style={estiloTab('todos')}>Todos</button>
        <button onClick={() => setCategoriaActiva('celulares')} style={estiloTab('celulares')}>📱 Celulares</button>
        <button onClick={() => setCategoriaActiva('accesorios')} style={estiloTab('accesorios')}>🔌 Accesorios</button>
      </div>

      {productosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.5, fontSize: '0.95rem', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '20px' }}>
          No se encontraron artículos.
        </div>
      ) : (
        <>
          {/* GRILLA OPTIMIZADA */}
          <div className="grid-productos">
            {productosPaginados.map((p) => (
              <div key={p.id} className="card-producto">
                {/* Al tocar la foto, se guarda el producto en el estado para abrir el zoom */}
                <div className="img-contenedor-mobile" onClick={() => setProductoSeleccionado(p)}>
                  <img src={p.img} alt={p.nombre} className="img-catalogo" />
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 className="card-title-mobile" style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', height: '38px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', color: '#fff' }}>
                    {p.nombre}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="card-precio-mobile" style={{ color: azulModerno, fontWeight: '800', fontSize: '1.25rem' }}>
                      ${p.precio.toLocaleString('es-AR')}
                    </span>
                    <button onClick={() => agregarAlCarrito(p)} className="btn-agregar-carrito">
                      <FaShoppingCart size={13} /> AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN COMPACTA */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '35px' }}>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => {
                const esActiva = paginaActual === num;
                return (
                  <button
                    key={num} onClick={() => setPaginaActual(num)}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${esActiva ? azulModerno : 'rgba(255,255,255,0.1)'}`, backgroundColor: esActiva ? azulModerno : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* --- MODAL FLOTANTE: ZOOM DE FOTO Y TEXTO COMPLETO PARA CELULARES Y PC --- */}
      {productoSeleccionado && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
          {/* Fondo oscuro para cerrar si hacen click afuera de la tarjeta */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} onClick={() => setProductoSeleccionado(null)}></div>
          
          {/* Contenedor de la vista ampliada */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: '#0f172a', borderRadius: '28px', border: `1px solid ${azulModerno}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'popIn 0.25s ease-out', zIndex: 5001 }}>
            
            {/* Botón flotante para cerrar la vista zoom */}
            <button onClick={() => setProductoSeleccionado(null)} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <FaTimes size={16} />
            </button>

            {/* Foto escalada en alta resolución / tamaño grande */}
            <div style={{ width: '100%', height: '300px', backgroundColor: '#000', overflow: 'hidden' }}>
              <img src={productoSeleccionado.img} alt={productoSeleccionado.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Detalles completos sin recortes de texto */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: azulModerno, fontWeight: '800', letterSpacing: '1px' }}>
                Categoría: {productoSeleccionado.categoria}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#fff', lineHeight: '1.4' }}>
                {productoSeleccionado.nombre}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>
                  ${productoSeleccionado.precio.toLocaleString('es-AR')}
                </span>
                <button 
                  onClick={() => {
                    agregarAlCarrito(productoSeleccionado);
                    setProductoSeleccionado(null); // Opcional: cierra al añadir
                  }} 
                  className="btn-agregar-carrito" 
                  style={{ width: 'auto', padding: '14px 24px', fontSize: '0.9rem' }}
                >
                  <FaShoppingCart size={15} /> AGREGAR
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE DE CARRITO (PULGAR MÓVIL) - SUBIDO PARA NO CHOCAR */}
{cantidadTotal > 0 && (
  <button 
    className="btn-flotante-carrito" 
    onClick={() => setMostrarCarrito(true)}
    style={{ 
      bottom: '105px',                  
      backgroundColor: azulModerno,     
      position: 'fixed'                 
    }}
  >
    <FaShoppingCart size={22} />
    <div style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '900', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {cantidadTotal}
    </div>
  </button>
)}

</section>
);
}