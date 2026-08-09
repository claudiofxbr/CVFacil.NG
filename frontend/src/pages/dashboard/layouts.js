import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../../components/common/Sidebar';
import { 
  AppContainer, 
  MainContent, 
  SectionTitle 
} from '../../components/dashboard/DashboardElements';
import { Layout, Palette, Zap, Star, Shield, Cpu, Users, PenTool, ClipboardList } from 'lucide-react';

const layouts = [
  { id: 'academic-sleek', name: 'Academic Sleek', tag: 'Premium', preview: '#f8fafc', icon: <PenTool size={32} color="#1a1a1a" />, desc: 'Elegância acadêmica com fontes serifadas e layout estruturado para pesquisadores e professores.' },
  { id: 'modern-tech', name: 'Modern Tech', tag: 'Premium', preview: '#0a0a0a', icon: <Cpu size={32} color="#00ff88" />, desc: 'Estética futurista em Dark Mode com cores neon, ideal para desenvolvedores e TI.' },
  { id: 'minimalist-vertical', name: 'Minimalist Vertical', tag: 'Grátis', preview: '#ffffff', icon: <Layout size={32} color="#333" />, desc: 'Design limpo e focado na tipografia. Máxima legibilidade com alto contraste.' },
  { id: 'creative-grid', name: 'Creative Grid', tag: 'Premium', preview: '#0f172a', icon: <Zap size={32} color="#bc13fe" />, desc: 'Layout em grade com glassmorphism e gradientes vibrantes para perfis criativos.' },
  { id: 'executive-classical', name: 'Executive Classical', tag: 'Premium', preview: '#ffffff', icon: <Shield size={32} color="#1e293b" />, desc: 'Sobra e elegância para cargos de liderança e diretoria, com detalhes premium.' },
  { id: 'tech-startup', name: 'Tech Startup', tag: 'Premium', preview: '#f8fafc', icon: <Users size={32} color="#3b82f6" />, desc: 'Design amigável em blocos, focado em cultura de startup e agilidade.' },
  { id: 'timeline-elegant', name: 'Timeline Elegant', tag: 'Premium', preview: '#ffffff', icon: <ClipboardList size={32} color="#333" />, desc: 'Apresenta sua trajetória como uma jornada visual através de uma linha do tempo refinada.' },
  { id: 'artistic-focus', name: 'Artistic Focus', tag: 'Premium', preview: '#111111', icon: <Star size={32} color="#ff3e00" />, desc: 'Impacto visual forte com foto em destaque e tipografia assimétrica arrojada.' },
  { id: 'simple-clean', name: 'Simple Clean', tag: 'Grátis', preview: '#ffffff', icon: <Layout size={32} color="#2d3436" />, desc: 'O clássico profissional refinado. Perfeito para qualquer área e pronto para ATS.' }
];

export default function LayoutsGallery() {
  const router = useRouter();

  return (
    <AppContainer>
      <Head>
        <title>Galeria de Layouts | CVFacil.NG</title>
      </Head>
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: '40px' }}>
          <SectionTitle>Galeria de Layouts Premium</SectionTitle>
          <p style={{ color: 'var(--text-secondary)' }}>Fizemos um upgrade! Explore 9 novos designs criados para elevar sua apresentação profissional.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {layouts.map(layout => (
            <div key={layout.id} className="card-premium" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '240px', 
                background: layout.preview, 
                borderRadius: '16px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ transform: 'scale(1.5)', opacity: 0.8 }}>
                  {layout.icon}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: layout.tag === 'Premium' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: layout.tag === 'Premium' ? 'var(--bg-deep)' : 'white',
                  backdropFilter: 'blur(4px)'
                }}>
                  {layout.tag}
                </div>
              </div>
              
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>{layout.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6, flex: 1 }}>{layout.desc}</p>
              
              <button 
                onClick={() => router.push(`/dashboard/create?layout=${layout.id}`)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-glass)',
                  padding: '14px',
                  borderRadius: '14px',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginTop: 'auto'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--bg-deep)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Começar com este Estilo
              </button>
            </div>
          ))}
        </div>
      </MainContent>
    </AppContainer>
  );
}
