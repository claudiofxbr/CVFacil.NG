import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layout, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="glass-panel" style={{ 
      margin: '1rem', 
      padding: '0.75rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
        <img 
          src="/images/logo.png" 
          alt="XavierBr.Net / CVFacil.NG Logo" 
          style={{ height: '36px', width: 'auto', borderRadius: '6px', objectFit: 'contain' }}
        />
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
          CVFACIL<span className="neon-text-purple">.NG</span>
        </span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Painel</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f3ff' }}>{user.fullName || user.username}</span>
              <span style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase' }}>Assinante NG</span>
            </div>
            <button 
              onClick={handleLogout}
              className="glass-panel"
              style={{ 
                padding: '0.5rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ff4d4d',
                cursor: 'pointer',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <LogOut size={16} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>SAIR</span>
            </button>
          </div>
        ) : (
          <Link href="/login" className="glass-panel neon-border-cyan" style={{ 
            padding: '0.5rem 1rem', 
            color: 'var(--neon-cyan)', 
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
