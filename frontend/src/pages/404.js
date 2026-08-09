import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function Custom404() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '2rem',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Head>
        <title>404 - Página Não Encontrada | CVFacil.NG</title>
      </Head>

      {/* Elementos Decorativos de Fundo */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'rgba(0, 243, 255, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: '300px',
        height: '300px',
        background: 'rgba(188, 19, 254, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>

      <div className="glass-panel" style={{ 
        padding: '4rem', 
        borderRadius: '30px', 
        zIndex: 1, 
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '500px'
      }}>
        <AlertTriangle size={80} style={{ color: '#ff4d4d', marginBottom: '1.5rem' }} />
        
        <h1 style={{ 
          fontSize: '6rem', 
          margin: 0, 
          lineHeight: 1,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #fff, #444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#fff' }}>
          Ops! Caminho Perdido
        </h2>
        
        <p style={{ fontSize: '1rem', color: '#888', margin: '1.5rem 0 2.5rem 0', lineHeight: 1.6 }}>
          A página que você está procurando não existe ou foi movida para um novo endereço no ecossistema NG.
        </p>

        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            margin: '0 auto',
            padding: '1rem 2rem',
            borderRadius: '15px',
            border: 'none',
            background: 'linear-gradient(135deg, #00f3ff, #bc13fe)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: '0.3s',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <Home size={20} />
            Voltar ao Dashboard
          </button>
        </Link>
      </div>

      <footer style={{ position: 'absolute', bottom: '2rem', color: '#444', fontSize: '0.8rem' }}>
        CVFacil.NG &copy; {new Date().getFullYear()} | PortalCursos.NG Infrastructure
      </footer>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        button:hover {
          transform: translateY(-5px);
          filter: brightness(1.2);
          box-shadow: 0 15px 30px rgba(0, 243, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
