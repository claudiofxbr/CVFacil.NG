import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import API_URL from '../config';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      if (response.ok) {
        const authData = await response.json();
        alert('Cadastro realizado com sucesso!');
        login(authData.user, authData.token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setErrorMSG(errorData.error || 'Falha no cadastro.');
      }
    } catch (err) {
      setErrorMSG('Erro no servidor ou conexão rejeitada. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-deep)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '1rem'
    }}>
      <Head>
        <title>Criar Conta | CVFacil.NG</title>
      </Head>

      <div className="glass-panel" style={{ 
        padding: '3rem', 
        width: '100%', 
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-gradient-cyan-purple" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
            Criar Conta
          </h1>
          <p style={{ color: '#888', margin: 0 }}>Entre para a nova era dos currículos</p>
        </div>

        {errorMSG && (
          <div style={{ 
            padding: '0.8rem', 
            background: 'rgba(255, 0, 0, 0.1)', 
            border: '1px solid rgba(255, 0, 0, 0.3)', 
            borderRadius: '8px',
            color: '#ff4d4d',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {errorMSG}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome Completo</label>
            <input 
              type="text" 
              required
              className="glass-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: João Silva"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Usuário</label>
            <input 
              type="text" 
              required
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: joaosilva"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>E-mail</label>
            <input 
              type="email" 
              required
              className="glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@exemplo.com"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Senha</label>
            <input 
              type="password" 
              required
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #00f3ff, #bc13fe)',
              color: 'white',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.3s'
            }}
          >
            {loading ? 'Cadastrando...' : 'Criar minha conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
          Já possui conta? <Link href="/login" style={{ color: '#00f3ff', textDecoration: 'none' }}>Faça login</Link>
        </p>
      </div>
    </div>
  );
}
