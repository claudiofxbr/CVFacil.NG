import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#ff4d4d' }}>
        {statusCode ? statusCode : 'Erro'}
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px' }}>
        {statusCode
          ? `Ocorreu um erro ${statusCode} no servidor.`
          : 'Ocorreu um erro inesperado no cliente.'}
      </p>
      <button 
        onClick={() => window.location.href = '/dashboard'}
        style={{
          marginTop: '2rem',
          padding: '0.8rem 2rem',
          borderRadius: '10px',
          border: 'none',
          background: 'linear-gradient(135deg, #00f3ff, #bc13fe)',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Voltar para o Dashboard
      </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
