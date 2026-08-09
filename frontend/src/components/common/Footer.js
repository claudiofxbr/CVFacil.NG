import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
      padding: '40px 24px',
      background: 'var(--bg-deep, #0a0f1d)',
      color: 'var(--text-secondary, #888)',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Brand Logo in Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/images/logo.png" 
            alt="XavierBr.Net / CVFacil.NG Logo" 
            style={{ height: '48px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            CVFacil<span style={{ color: 'var(--neon-purple, #a855f7)' }}>.NG</span>
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
          © 2026 CVFacil.NG — Desenvolvido por <strong style={{ color: '#ffffff' }}>XavierBr.Net</strong> & <strong style={{ color: '#ffffff' }}>Unifacs Engenharia</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
