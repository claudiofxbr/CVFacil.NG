import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useAuth();

  // Mapeamento de Plano
  const getPlanName = (role) => {
    if (role === 'ROOT' || role === 'ADMIN') return 'Premium Plan';
    return 'Free Plan';
  };

  return (
    <header style={{
      height: '80px',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-glass)',
      background: 'var(--bg-deep)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Title & Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/images/logo.png" 
          alt="XavierBr.Net / CVFacil.NG Logo" 
          style={{ height: '32px', width: 'auto', borderRadius: '6px', objectFit: 'contain' }}
        />
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', margin: 0 }}>
          {title || 'Dashboard'}
        </h2>
      </div>

      {/* Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Fake Search */}
        <div style={{ position: 'relative', display: 'none' }}> {/* Hidden for now to match screenshot exactly */}
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 12px 10px 40px',
              color: 'white',
              fontSize: '0.9rem',
              width: '200px'
            }}
          />
        </div>

        {/* Notif */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: '#ff4d4d',
            borderRadius: '50%',
            border: '2px solid var(--bg-deep)'
          }}></div>
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-glass)', paddingLeft: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{user?.fullName || 'Usuário'}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{getPlanName(user?.role)}</p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid var(--border-glass)',
            background: 'var(--bg-card)'
          }}>
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyCenter: 'center', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))' }}>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700, margin: 'auto' }}>{user?.fullName?.charAt(0) || 'U'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
