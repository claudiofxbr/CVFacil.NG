import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../../components/common/Sidebar';
import { 
  AppContainer, 
  MainContent, 
  SectionTitle, 
  HeaderContainer,
  PrimaryButton 
} from '../../components/dashboard/DashboardElements';
import ActivityTable from '../../components/dashboard/ActivityTable';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
import { Plus } from 'lucide-react';

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const fetchResumes = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resumes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
        setError(null);
      } else {
        const errorData = await response.text();
        setError(`Erro ao carregar currículos: ${errorData}`);
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchResumes();
  }, [token, fetchResumes, router]);

  const handleEdit = (id) => {
    router.push(`/resume/builder/${id}`);
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetch(`${API_URL}/resumes/${id}/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `curriculo_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erro ao gerar PDF. Tente novamente mais tarde.');
      }
    } catch (error) {
      alert('Falha de conexão ao baixar o currículo.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja mover este currículo para a lixeira?')) return;
    
    try {
      const response = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Erro ao excluir o currículo.');
      }
    } catch (error) {
      alert('Erro de conexão ao excluir.');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, envie um arquivo em formato PDF.');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/resumes/import`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const newResume = await response.json();
        // Redirect immediately to builder
        router.push(`/resume/builder/${newResume.id}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido na importação.' }));
        alert(`Falha na Importação: ${errorData.message || 'O arquivo pode ser inválido ou o serviço está indisponível.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao tentar importar o currículo.');
    } finally {
      setImporting(false);
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  return (
    <AppContainer>
      <Head>
        <title>Meus Currículos | CVFacil.NG</title>
      </Head>
      
      <Sidebar />
      <MainContent>
        <HeaderContainer>
          <SectionTitle>Gestão de Currículos</SectionTitle>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="file" 
              accept="application/pdf" 
              style={{ display: 'none' }} 
              ref={fileInputRef} 
              onChange={handleImport} 
            />
            <PrimaryButton 
              onClick={() => fileInputRef.current?.click()} 
              disabled={importing}
              style={{ background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
              <Plus size={20} /> {importing ? 'Importando (IA)...' : 'Importar Currículo'}
            </PrimaryButton>
            <PrimaryButton onClick={() => router.push('/dashboard/create')}>
              <Plus size={20} /> Novo Currículo
            </PrimaryButton>
          </div>
        </HeaderContainer>

        {error && (
          <div className="alert-error" style={{ marginBottom: '20px', padding: '15px', borderRadius: '12px', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
            {error}
            <button onClick={fetchResumes} style={{ marginLeft: '15px', background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
              Tentar novamente
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
            <div className="loader" style={{ marginBottom: '20px' }}></div>
            Carregando seus currículos...
          </div>
        ) : (
          <ActivityTable 
            resumes={resumes} 
            onEdit={handleEdit} 
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}

