import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { AppContainer, MainContent } from '../components/dashboard/DashboardElements';
import StatCard from '../components/dashboard/StatCard';
import ActivityTable from '../components/dashboard/ActivityTable';
import { Plus, FileText, Trash2, Layout } from 'lucide-react';
import API_URL from '../config';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    if (user) {
      fetchResumes();
      checkBackend();
    }
  }, [user]);

  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/public/status`);
      setBackendStatus(response.ok ? 'online' : 'offline');
    } catch (e) {
      setBackendStatus('offline');
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const response = await fetch(`${API_URL}/resumes`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    if (!user) return;
    try {
      const newResume = {
        title: 'Novo Currículo ' + new Date().toLocaleDateString(),
        summary: 'Inicie seu resumo profissional aqui...',
        isPublic: false,
        isPrimary: resumes.length === 0
      };

      const response = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newResume),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/resume/builder/${data.id}`);
      } else {
        alert('Erro ao criar currículo. Verifique a conexão.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Falha crítica de conexão com o backend.');
    }
  };

  const handleEdit = (id) => {
    router.push(`/resume/builder/${id}`);
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetch(`${API_URL}/resumes/${id}/export`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Curriculo_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Falha ao baixar PDF:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja mover este currículo para a lixeira?')) return;
    
    try {
      const response = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
      } else {
        const errorData = await response.json().catch(() => ({}));
        const userMessage = errorData.message || `Erro ${response.status} ao excluir.`;
        console.error(`[DELETE-ERROR]`, errorData);
        alert(`Não foi possível excluir o currículo: ${userMessage}`);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Falha de rede ao tentar excluir o currículo. Verifique sua conexão.');
    }
  };

  return (
    <AppContainer>
      <Head>
        <title>Dashboard | CVFacil.NG</title>
      </Head>

      <Sidebar />

      <MainContent>
        <Header title="Visão Geral do Painel" />

        <div style={{ width: '100%' }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Olá, <span className="text-gradient-cyan-purple">{user?.fullName?.split(' ')[0] || 'Profissional'}!</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.05rem' }}>
              Bem-vindo de volta ao seu centro de excelência em carreira.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px',
            marginBottom: '48px'
          }}>
            <StatCard 
              title="Currículos Criados" 
              value={resumes.length} 
              label="Ver todos os arquivos" 
              icon={<FileText size={32} />} 
              onClick={() => router.push('/dashboard/resumes')}
            />
            <StatCard 
              title="Layouts Ativos" 
              value="12" 
              label="Explorar Biblioteca" 
              icon={<Layout size={32} />} 
              onClick={() => router.push('/dashboard/layouts')}
            />
            <StatCard 
              title="Criar Novo" 
              value="Novo Arquivo" 
              type="action"
              icon={<Plus size={32} />} 
              onClick={handleCreateResume}
            />
          </div>

          {/* Activity Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Atividade Recente</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status dos seus últimos documentos editados</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/resumes')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--neon-cyan)', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Ver Histórico Completo
              </button>
            </div>

            {loading ? (
              <div className="card-premium" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader">Carregando seus dados...</div>
              </div>
            ) : (
              <ActivityTable 
                resumes={resumes.slice(0, 5)} 
                onEdit={handleEdit}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            )}
          </section>

          {/* Backend Status Floating Indicator */}
          {backendStatus === 'offline' && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              padding: '12px 20px',
              background: 'rgba(255, 77, 77, 0.9)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(255, 77, 77, 0.3)',
              zIndex: 1000
            }}>
              <Trash2 size={18} /> Erro de Conexão com o Servidor
            </div>
          )}
        </div>
      </MainContent>
    </AppContainer>
  );
}
