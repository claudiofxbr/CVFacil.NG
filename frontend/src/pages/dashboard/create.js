import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

export default function CreateResume() {
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const autoCreate = async () => {
      if (!token) return; // Aguarda o token estar disponível no contexto

      try {
        const { layout } = router.query;
        const newResume = {
          title: 'Meu Currículo ' + new Date().toLocaleDateString('pt-BR'),
          summary: 'Inicie seu resumo profissional aqui...',
          isPublic: false,
          isPrimary: false,
          layoutId: layout || 'modern-tech'
        };

        const response = await fetch(`${API_URL}/resumes`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newResume),
        });

        if (response.ok) {
          const data = await response.json();
          router.push(`/resume/builder/${data.id}`);
        } else {
          console.error('Erro na resposta do servidor:', response.status);
          alert('Erro ao criar currículo. Redirecionando...');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Falha na criação:', error);
        router.push('/dashboard');
      }
    };

    autoCreate();
  }, [user, token, router.isReady, router.query]);

  return (
    <div style={{ 
      height: '100vh', 
      background: 'var(--bg-deep)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="loader" style={{ marginBottom: '20px' }}></div>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Preparando seu novo ambiente...</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Estamos criando seu currículo titanium.</p>
    </div>
  );
}
