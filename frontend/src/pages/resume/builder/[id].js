import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Printer, Plus, Trash2, Camera, User, Briefcase, GraduationCap, Star, Globe, Heart, Palette, Lock, Unlock, Upload, Layout } from 'lucide-react';
import ThemeEngine from '../../../components/resume/ThemeEngine';
import API_URL from '../../../config';
import DOMPurify from 'dompurify';
import { gsap } from 'gsap';

const themes = [
  { id: 'academic-sleek', name: 'Academic Sleek' },
  { id: 'modern-tech', name: 'Modern Tech' },
  { id: 'minimalist-vertical', name: 'Minimalist Vertical' },
  { id: 'creative-grid', name: 'Creative Grid' },
  { id: 'executive-classical', name: 'Executive Classical' },
  { id: 'tech-startup', name: 'Tech Startup' },
  { id: 'timeline-elegant', name: 'Timeline Elegant' },
  { id: 'artistic-focus', name: 'Artistic Focus' },
  { id: 'simple-clean', name: 'Simple Clean' }
];

export default function ResumeBuilder() {
  const router = useRouter();
  const { id } = router.query;
  const { token, logout } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showThemes, setShowThemes] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isLocked, setIsLocked] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const [showPrintHelp, setShowPrintHelp] = useState(false);
  const [isCurtainMode, setIsCurtainMode] = useState(false);
  const [trash, setTrash] = useState({
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    hobbies: []
  });

  useEffect(() => {
    const savedWidth = localStorage.getItem('cvfacil_sidebar_width');
    const savedLock = localStorage.getItem('cvfacil_sidebar_locked');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
    if (savedLock) setIsLocked(savedLock === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('cvfacil_sidebar_width', sidebarWidth);
    localStorage.setItem('cvfacil_sidebar_locked', isLocked);
  }, [sidebarWidth, isLocked]);

  // 1. Carregamento Inicial: Prioridade para o rascunho local
  useEffect(() => {
    if (!id) return;

    const loadResume = async () => {
      setLoading(true);
      
      // Tentar carregar rascunho local primeiro
      const localDraft = localStorage.getItem(`cvfacil_draft_${id}`);
      
      if (localDraft) {
        try {
          const parsedDraft = JSON.parse(localDraft);
          console.log("Rascunho local carregado com sucesso.");
          setResume(parsedDraft);
          setLoading(false);
          return; // Se carregou o local, não precisa da API agora
        } catch (e) {
          console.error("Erro ao ler rascunho local:", e);
        }
      }

      // Se não houver local, buscar na API
      try {
        if (!token) return;
        const res = await fetch(`${API_URL}/resumes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) throw new Error("Falha ao buscar na API");
        
        const data = await res.json();
        
        // Inicializar listas vazias se não presentes
        if (!data.experiences) data.experiences = [];
        if (!data.educations) data.educations = [];
        if (!data.skills) data.skills = [];
        if (!data.languages) data.languages = [];
        if (!data.hobbies) data.hobbies = [];
        
        setResume(data);
      } catch (err) {
        console.error('Error fetching resume:', err);
        // Se der erro na API e não tiver local, infelizmente não há o que mostrar
        // mas aqui poderíamos criar um objeto vazio como último recurso
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id, token]);

  // 2. Auto-Save Local: Salvar no localStorage sempre que o currículo mudar
  useEffect(() => {
    if (resume && id) {
      localStorage.setItem(`cvfacil_draft_${id}`, JSON.stringify(resume));
    }
  }, [resume, id]);

  // 3. Cloud Sync: Sincronização automática com a nuvem (Debounced)
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'error'
  
  useEffect(() => {
    if (!resume || !id) return;

    const syncToCloud = async () => {
      setSyncStatus('syncing');
      try {
        if (!token) return;
        const response = await fetch(`${API_URL}/resumes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(resume),
        });

        if (!response.ok) throw new Error('Falha na sincronização');
        
        console.log("Sincronização com a nuvem concluída.");
        setSyncStatus('synced');
      } catch (err) {
        console.error("Erro no Cloud Sync:", err);
        setSyncStatus('error');
      }
    };

    // Debounce de 3 segundos para evitar excesso de requisições
    const timer = setTimeout(() => {
      syncToCloud();
    }, 3000);

    return () => clearTimeout(timer);
  }, [resume, id]);

  useLayoutEffect(() => {
    // Animar os cards do editor quando eles entram no DOM
    const cards = document.querySelectorAll('.builder-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [resume?.experiences?.length, resume?.educations?.length, resume?.skills?.length]);

  useEffect(() => {
    // Animação extra para o modo cortina se necessário
    if (previewRef.current && isCurtainMode) {
      gsap.to(previewRef.current, {
        duration: 0.8,
        padding: '4rem 2rem',
        ease: 'expo.inOut'
      });
    }
  }, [isCurtainMode]);

  const handleUpdateResume = (field, value) => {
    const sanitizedValue = typeof value === 'string' ? DOMPurify.sanitize(value) : value;
    setResume(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleListUpdate = (listName, index, field, value) => {
    const sanitizedValue = typeof value === 'string' ? DOMPurify.sanitize(value) : value;
    const newList = [...resume[listName]];
    newList[index] = { ...newList[index], [field]: sanitizedValue };
    setResume(prev => ({ ...prev, [listName]: newList }));
  };

  const addListItem = (listName, defaultObj) => {
    setResume(prev => ({ ...prev, [listName]: [...prev[listName], defaultObj] }));
  };

  const removeListItem = (listName, index) => {
    const itemToRemove = resume[listName][index];
    
    // Mover para a lixeira antes de remover
    setTrash(prev => ({
      ...prev,
      [listName]: [...prev[listName], { ...itemToRemove, originalIndex: index }]
    }));

    const newList = [...resume[listName]];
    newList.splice(index, 1);
    setResume(prev => ({ ...prev, [listName]: newList }));
  };

  const restoreFromTrash = (listName, trashIndex) => {
    const itemToRestore = trash[listName][trashIndex];
    
    // Adicionar de volta à lista original
    setResume(prev => ({
      ...prev,
      [listName]: [...prev[listName], itemToRestore]
    }));

    // Remover da lixeira
    const newTrashList = [...trash[listName]];
    newTrashList.splice(trashIndex, 1);
    setTrash(prev => ({ ...prev, [listName]: newTrashList }));
  };

  const handlePrint = () => {
    // Adiciona classe temporária para garantir que o preview ocupe a página toda
    window.print();
  };

  const handlePrintPDF = () => {
    setShowPrintHelp(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação de tamanho para não estourar o localStorage (limite sugerido 2MB para a foto)
    if (file.size > 2 * 1024 * 1024) {
      alert("A foto é muito grande. Escolha uma imagem de até 2MB para garantir o salvamento local.");
      return;
    }

    setUploadingPhoto(true);
    
    try {
      // 1. Ler arquivo localmente como Base64 para persistência total
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        handleUpdateResume('photoUrl', base64Data);
        setUploadingPhoto(false);
        console.log("Foto carregada e convertida para Base64 localmente.");
      };
      reader.onerror = () => {
        console.error("Erro ao ler arquivo local.");
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);

      // 2. (Opcional) Tentar enviar para o servidor como backup, mas sem travar a UI
      const formData = new FormData();
      formData.append('file', file);
      if (resume.userId) formData.append('userId', resume.userId);
      
      fetch(`${API_URL}/storage/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      }).catch(err => console.warn("Backup de foto no servidor falhou, mas a versão local está ativa.", err));

    } catch (err) {
      console.error('Photo processing error:', err);
      setUploadingPhoto(false);
    }
  };

  const startResizing = useCallback(() => {
    if (!isLocked) setIsResizing(true);
  }, [isLocked]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleMouseMove, stopResizing]);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Carregando Editor...</div>;
  if (!resume) return <div style={{ color: 'white', padding: '2rem' }}>Currículo não encontrado.</div>;

  return (
    <div id="resume-builder-root" style={{ minHeight: '100vh', background: '#050505', color: '#eee' }}>
      <Head>
        <title>Builder | {resume.title}</title>
        <title>Builder | {resume.title}</title>
        <style>{`
            @media print {
              @page {
                margin: 0 !important;
                size: A4 portrait !important;
              }
              
              html, body, #__next, #resume-builder-root {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              display: block !important;
            }

            .builder-main, .preview-section {
              height: auto !important;
              overflow: visible !important;
              display: block !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
              border: none !important;
            }

            .resume-print-wrapper, .resume-print-wrapper * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .resume-print-wrapper {
              position: relative !important;
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 auto !important;
              background: white !important;
              box-shadow: none !important;
              display: flex !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-scheme: light dark !important;
              transform: none !important; /* Desabilita scale se estiver em curtain mode */
            }

            /* Garantir que texto seja visível mesmo se fundo falhar */
            h1, h2, h3, p, span, strong {
              position: relative !important;
              z-index: 1 !important;
            }

            .no-print, .builder-divider, .builder-sidebar, .navbar, .page-break-indicator {
              display: none !important;
            }
          }

          /* Guide styling for the editor */
          .page-break-indicator {
            position: absolute;
            top: 297mm;
            left: 0;
            width: 100%;
            border-top: 2px dashed rgba(188, 19, 254, 0.4);
            z-index: 10;
            pointer-events: none;
          }
          .page-break-indicator::after {
            content: 'LIMITE DA PÁGINA A4';
            position: absolute;
            right: 10px;
            top: -20px;
            font-size: 10px;
            color: rgba(188, 19, 254, 0.6);
            font-weight: bold;
          }

          .builder-input-lg {
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 1rem 1.2rem;
            color: white;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            outline: none;
          }
          .builder-input-lg:focus {
            border-color: #00f3ff;
            background: #222;
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.15), inset 0 0 10px rgba(0, 243, 255, 0.05);
            transform: translateY(-2px);
          }
          
          .builder-input-sm {
            width: 100%;
            background: #222;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 0.7rem 1rem;
            color: white;
            font-size: 0.9rem;
            transition: 0.2s;
            outline: none;
          }
          .builder-input-sm:focus {
            border-color: #bc13fe;
            background: #2a2a2a;
          }

          .builder-card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 16px;
            padding: 1.5rem;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            transition: 0.3s;
          }
          .builder-card:hover {
            border-color: #444;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }

          .trash-icon {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: #444;
            cursor: pointer;
            transition: 0.2s;
          }
          .trash-icon:hover {
            color: #ff4d4d;
            transform: scale(1.2);
          }

          .builder-add-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(188, 19, 254, 0.15);
            border: 1px dashed #bc13fe;
            color: #bc13fe;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: bold;
            transition: 0.2s;
          }
          .builder-add-btn:hover {
            background: #bc13fe;
            color: white;
            border-style: solid;
          }

          .photo-frame-3x4 {
            border: 8px solid white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 0 1px #ddd;
          }

          .skill-level-btn {
            width: 35px;
            height: 35px;
            border-radius: 6px;
            border: 1px solid #333;
            background: #222;
            color: #888;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            transition: 0.2s;
          }
          .skill-level-btn.active {
            background: #00f3ff;
            color: black;
            border-color: #00f3ff;
            font-weight: bold;
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
          }
          .skill-level-btn:hover:not(.active) {
            border-color: #00f3ff;
            color: #00f3ff;
          }

          .trash-restorer {
            background: rgba(255, 255, 255, 0.05);
            border: 1px dashed #444;
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        `}</style>
      </Head>

      <div data-html2canvas-ignore="true" className="no-print" style={{ display: 'flex', borderBottom: '1px solid #222', padding: '0.75rem 2rem', alignItems: 'center', background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ marginLeft: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Editando: {resume.title}</h2>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ 
          marginRight: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', 
          color: syncStatus === 'error' ? '#ff4d4d' : syncStatus === 'syncing' ? '#bc13fe' : '#00f3ff', 
          fontSize: '0.85rem', opacity: 0.8, transition: '0.3s' 
        }}>
          <div style={{ 
            width: '8px', height: '8px', 
            background: syncStatus === 'error' ? '#ff4d4d' : syncStatus === 'syncing' ? '#bc13fe' : '#00f3ff', 
            borderRadius: '50%', 
            boxShadow: syncStatus === 'error' ? '0 0 10px #ff4d4d' : syncStatus === 'syncing' ? '0 0 10px #bc13fe' : '0 0 10px #00f3ff',
            animation: syncStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none'
          }} />
          {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'error' ? 'Erro ao salvar' : 'Sincronizado na Nuvem'}
        </div>
        <button 
          onClick={handlePrintPDF} 
          style={{ 
            display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.6rem 1.5rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #00f3ff, #bc13fe)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(188, 19, 254, 0.3)'
          }}
        >
          <Printer size={18} /> Imprimir PDF
        </button>
      </div>

      <main className="builder-main" style={{ display: 'flex', height: 'calc(100vh - 65px)', position: 'relative', overflow: 'hidden' }}>
        {/* Botão Cortina - Flutuante */}
        <button 
          onClick={() => setIsCurtainMode(!isCurtainMode)}
          className="no-print"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: isCurtainMode ? '50%' : '40%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            color: '#00f3ff',
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            fontWeight: 'bold',
            boxShadow: isCurtainMode ? '0 0 20px rgba(0, 243, 255, 0.4)' : '0 10px 30px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
        >
          <Layout size={18} />
          {isCurtainMode ? 'SAIR DA CORTINA' : 'MODO CORTINA'}
        </button>

        {/* Left Side: Live Preview (40% default, 100% in Curtain Mode) */}
        <section 
          ref={previewRef}
          className="preview-section"
          style={{ 
            width: isCurtainMode ? '100%' : '40%', 
            background: '#121212', 
            padding: isCurtainMode ? '4rem 2rem' : '2rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRight: isCurtainMode ? 'none' : '1px solid #222',
            transition: 'width 0.6s cubic-bezier(0.87, 0, 0.13, 1), padding 0.6s ease',
            zIndex: isCurtainMode ? 999 : 1
          }}>
          <div className="no-print" style={{ 
            marginBottom: '1.5rem', background: 'rgba(188, 19, 254, 0.1)', padding: '0.6rem 1.2rem', borderRadius: '50px', 
            border: '1px solid rgba(188, 19, 254, 0.3)', color: '#bc13fe', fontSize: '0.75rem', fontWeight: 'bold',
            opacity: isCurtainMode ? 0 : 1, transition: '0.3s'
          }}>
            PREVIEW REAL-TIME {isCurtainMode ? '(100%)' : '(40%)'}
          </div>
          
          <div className="resume-print-wrapper" style={{
            transform: isCurtainMode ? 'scale(0.9)' : 'scale(0.55)',
            transformOrigin: 'top center',
            transition: 'transform 0.6s cubic-bezier(0.87, 0, 0.13, 1)',
            position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            background: 'white'
          }}>
            <ThemeEngine resume={resume} layoutId={resume.layoutId} id="resume-preview" />
            <div className="page-break-indicator" />
          </div>
        </section>

        {/* Right Side: Form (60% default, hidden in Curtain Mode) */}
        <section 
          ref={editorRef}
          className="no-print"
          data-html2canvas-ignore="true"
          style={{ 
            width: isCurtainMode ? '0' : '60%',
            flex: isCurtainMode ? 'none' : 1,
            overflowY: 'auto', 
            padding: isCurtainMode ? '0' : '2rem', 
            background: '#0f0f0f', 
            position: 'relative',
            opacity: isCurtainMode ? 0 : 1,
            pointerEvents: isCurtainMode ? 'none' : 'auto',
            transition: 'width 0.6s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.4s ease, padding 0.6s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              onClick={() => setIsLocked(!isLocked)}
              title={isLocked ? "Destravar largura da barra" : "Prender largura da barra"}
              style={{ 
                background: isLocked ? 'rgba(0, 243, 255, 0.2)' : 'transparent', 
                border: '1px solid #333', color: isLocked ? '#00f3ff' : '#666', 
                padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              <span style={{ fontSize: '0.7rem' }}>{isLocked ? 'TRAVADO' : 'PRENDER BARRA'}</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Custom Theme Colors - NEW SECTION */}
            <div style={{ padding: '0.5rem 0' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1rem', color: '#00f3ff', marginBottom: '1.2rem' }}>
                <Palette size={20} /> CORES DO TEMA
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#1a1a1a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#888' }}>Primária</label>
                  <input type="color" value={resume.primaryColor || '#2563eb'} onChange={(e) => handleUpdateResume('primaryColor', e.target.value)} style={{ width: '100%', height: '35px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#888' }}>Secundária</label>
                  <input type="color" value={resume.secondaryColor || '#1e40af'} onChange={(e) => handleUpdateResume('secondaryColor', e.target.value)} style={{ width: '100%', height: '35px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#888' }}>Fundo</label>
                  <input type="color" value={resume.bgColor || '#ffffff'} onChange={(e) => handleUpdateResume('bgColor', e.target.value)} style={{ width: '100%', height: '35px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#888' }}>Texto</label>
                  <input type="color" value={resume.textColor || '#333333'} onChange={(e) => handleUpdateResume('textColor', e.target.value)} style={{ width: '100%', height: '35px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Theme Selection - CURTAIN MODE */}
            <div style={{ padding: '0.5rem 0' }}>
              <button 
                onClick={() => setShowThemes(!showThemes)}
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '1.2rem', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #333',
                  color: '#00f3ff', cursor: 'pointer', transition: '0.3s', fontSize: '1.1rem', fontWeight: 'bold'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Layout size={22} /> MÉTODOS DE LAYOUT
                </div>
                <div style={{ transform: showThemes ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
                  <Plus size={20} />
                </div>
              </button>
              
              <div style={{ 
                maxHeight: showThemes ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out',
                background: '#151515', borderRadius: '0 0 12px 12px', border: showThemes ? '1px solid #333' : 'none',
                borderTop: 'none', padding: showThemes ? '1.5rem' : '0 1.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                  {themes.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => handleUpdateResume('layoutId', t.id)}
                      style={{ 
                        padding: '0.8rem', borderRadius: '8px', border: resume.layoutId === t.id ? '1px solid #00f3ff' : '1px solid #333',
                        background: resume.layoutId === t.id ? 'rgba(0, 243, 255, 0.1)' : '#222', color: resume.layoutId === t.id ? '#00f3ff' : '#aaa',
                        fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s', textAlign: 'center'
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Section - 30% LARGER AREA */}
            <div style={{ padding: '0.5rem 0' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1.3rem', color: '#00f3ff', marginBottom: '1.5rem' }}>
                <User size={22} /> DADOS PESSOAIS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                <input 
                  type="text" placeholder="Nome Completo (Como aparecerá no CV)" className="builder-input-lg" value={resume.fullName || ''}
                  onChange={(e) => handleUpdateResume('fullName', e.target.value)}
                  style={{ borderLeft: '4px solid #bc13fe' }}
                />
                <input 
                  type="text" placeholder="Cargo / Profissão" className="builder-input-lg" value={resume.profession || ''}
                  onChange={(e) => handleUpdateResume('profession', e.target.value)}
                />
                <input 
                  type="text" placeholder="E-mail de Contato" className="builder-input-lg" value={resume.contactEmail || ''}
                  onChange={(e) => handleUpdateResume('contactEmail', e.target.value)}
                />
                <input 
                  type="text" placeholder="Celular / WhatsApp" className="builder-input-lg" value={resume.phone || ''}
                  onChange={(e) => handleUpdateResume('phone', e.target.value)}
                />
                <input 
                  type="text" placeholder="Site / Portfólio" className="builder-input-lg" value={resume.website || ''}
                  onChange={(e) => handleUpdateResume('website', e.target.value)}
                />
                <input 
                  type="text" placeholder="LinkedIn (URL)" className="builder-input-lg" value={resume.linkedinUrl || ''}
                  onChange={(e) => handleUpdateResume('linkedinUrl', e.target.value)}
                  style={{ borderLeft: '4px solid #0077b5' }}
                />
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#1a1a1a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #333' }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="photo-frame-3x4"
                    style={{ 
                      width: '100px', height: '133px', background: '#0a0a0a', 
                      overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}
                  >
                    {resume.photoUrl ? (
                      <img src={resume.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={30} color="#444" />
                    )}
                    {uploadingPhoto && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner-sm" />
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#888' }}>Foto do Perfil (3x4)</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#333', border: 'none', color: 'white', 
                        padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                      }}
                    >
                      <Upload size={16} /> {uploadingPhoto ? 'Enviando...' : 'Carregar Foto Local'}
                    </button>
                    <input 
                      type="file" ref={fileInputRef} hidden accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Formatos: JPG, PNG. Máx: 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Summary - 30% LARGER AREA */}
            <div style={{ padding: '0.5rem 0' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1.3rem', color: '#00f3ff', marginBottom: '1.5rem' }}>
                RESUMO PROFISSIONAL
              </h3>
              <textarea 
                rows={10} placeholder="Conte sua história profissional, objetivos e principais conquistas..." className="builder-input-lg" value={resume.summary || ''}
                onChange={(e) => handleUpdateResume('summary', e.target.value)}
                style={{ resize: 'vertical', minHeight: '150px' }}
              />
              
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1.1rem', color: '#00f3ff', marginTop: '1.5rem', marginBottom: '1rem' }}>
                QUALIFICAÇÕES PROFISSIONAIS
              </h3>
              <textarea 
                rows={10} placeholder="Liste suas principais certificações, prêmios ou qualificações de destaque..." className="builder-input-lg" value={resume.professionalQualifications || ''}
                onChange={(e) => handleUpdateResume('professionalQualifications', e.target.value)}
                style={{ resize: 'vertical', minHeight: '150px', borderLeft: '4px solid #bc13fe' }}
              />
            </div>

            {/* Experiences Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#00f3ff', margin: 0 }}>
                  <Briefcase size={18} /> EXPERIÊNCIAS
                </h3>
                <button onClick={() => addListItem('experiences', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="builder-add-btn">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resume.experiences.map((exp, idx) => (
                  <div key={idx} className="builder-card">
                    <Trash2 size={16} className="trash-icon" onClick={() => removeListItem('experiences', idx)} />
                    <input type="text" placeholder="Empresa" className="builder-input-sm" value={exp.company} onChange={(e) => handleListUpdate('experiences', idx, 'company', e.target.value)} />
                    <input type="text" placeholder="Cargo" className="builder-input-sm" value={exp.position} onChange={(e) => handleListUpdate('experiences', idx, 'position', e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" placeholder="Início" className="builder-input-sm" value={exp.startDate} onChange={(e) => handleListUpdate('experiences', idx, 'startDate', e.target.value)} />
                      <input type="text" placeholder="Fim" className="builder-input-sm" value={exp.endDate} onChange={(e) => handleListUpdate('experiences', idx, 'endDate', e.target.value)} />
                    </div>
                    <textarea 
                      placeholder="Descreva detalhadamente suas atividades, responsabilidades e conquistas nesta experiência..." 
                      className="builder-input-sm" 
                      rows={5}
                      value={exp.description} 
                      onChange={(e) => handleListUpdate('experiences', idx, 'description', e.target.value)} 
                    />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', color: '#888' }}>Conhecimento (%)</label>
                        <input type="number" min="0" max="100" className="builder-input-sm" value={exp.knowledgePercentage || 0} onChange={(e) => handleListUpdate('experiences', idx, 'knowledgePercentage', parseInt(e.target.value))} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: '0.7rem', color: '#888' }}>Qualificações Específicas</label>
                        <input type="text" placeholder="Ex: Liderança, Scrum, Java" className="builder-input-sm" value={exp.qualifications || ''} onChange={(e) => handleListUpdate('experiences', idx, 'qualifications', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                
                {trash.experiences.length > 0 && (
                  <div className="trash-restorer">
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ITENS REMOVIDOS (LIXEIRA)</p>
                    {trash.experiences.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: '#555' }}>{t.company} - {t.position}</span>
                        <button onClick={() => restoreFromTrash('experiences', idx)} style={{ background: 'none', border: 'none', color: '#bc13fe', cursor: 'pointer', fontSize: '0.75rem' }}>Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#00f3ff', margin: 0 }}>
                  <GraduationCap size={18} /> FORMAÇÃO
                </h3>
                <button onClick={() => addListItem('educations', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className="builder-add-btn">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resume.educations.map((edu, idx) => (
                  <div key={idx} className="builder-card">
                    <Trash2 size={16} className="trash-icon" onClick={() => removeListItem('educations', idx)} />
                    <input type="text" placeholder="Instituição" className="builder-input-sm" value={edu.institution} onChange={(e) => handleListUpdate('educations', idx, 'institution', e.target.value)} />
                    <input type="text" placeholder="Grau / Curso" className="builder-input-sm" value={edu.degree} onChange={(e) => handleListUpdate('educations', idx, 'degree', e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" placeholder="Início" className="builder-input-sm" value={edu.startDate} onChange={(e) => handleListUpdate('educations', idx, 'startDate', e.target.value)} />
                      <input type="text" placeholder="Fim" className="builder-input-sm" value={edu.endDate} onChange={(e) => handleListUpdate('educations', idx, 'endDate', e.target.value)} />
                    </div>
                  </div>
                ))}

                {trash.educations.length > 0 && (
                  <div className="trash-restorer">
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ITENS REMOVIDOS (LIXEIRA)</p>
                    {trash.educations.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: '#555' }}>{t.institution} - {t.degree}</span>
                        <button onClick={() => restoreFromTrash('educations', idx)} style={{ background: 'none', border: 'none', color: '#bc13fe', cursor: 'pointer', fontSize: '0.75rem' }}>Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#00f3ff', margin: 0 }}>
                  <Star size={18} /> COMPETÊNCIAS (Nível 1-10)
                </h3>
                <button onClick={() => addListItem('skills', { name: '', percentage: 50 })} className="builder-add-btn">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {resume.skills.map((skill, idx) => (
                  <div key={idx} className="builder-card" style={{ padding: '1.2rem' }}>
                    <Trash2 size={16} className="trash-icon" onClick={() => removeListItem('skills', idx)} />
                    <input type="text" placeholder="Competência (ex: JavaScript, Gestão de Pessoas)" className="builder-input-sm" value={skill.name} onChange={(e) => handleListUpdate('skills', idx, 'name', e.target.value)} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Nível Proeficiência</span>
                        <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>{skill.percentage / 10}/10</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
                        {[...Array(10)].map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleListUpdate('skills', idx, 'percentage', (i + 1) * 10)}
                            className={`skill-level-btn ${skill.percentage === (i + 1) * 10 ? 'active' : ''}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {trash.skills.length > 0 && (
                  <div className="trash-restorer">
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ITENS REMOVIDOS (LIXEIRA)</p>
                    {trash.skills.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: '#555' }}>{t.name || '(Sem nome)'}</span>
                        <button onClick={() => restoreFromTrash('skills', idx)} style={{ background: 'none', border: 'none', color: '#bc13fe', cursor: 'pointer', fontSize: '0.75rem' }}>Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#00f3ff', margin: 0 }}>
                  <Globe size={18} /> IDIOMAS
                </h3>
                <button onClick={() => addListItem('languages', { name: '', level: 'Intermediário' })} className="builder-add-btn">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resume.languages.map((lang, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" placeholder="Idioma" className="builder-input-sm" style={{ flex: 2 }} value={lang.name} onChange={(e) => handleListUpdate('languages', idx, 'name', e.target.value)} />
                    <select className="builder-input-sm" style={{ flex: 1.5, background: '#1a1a1a', color: 'white' }} value={lang.level} onChange={(e) => handleListUpdate('languages', idx, 'level', e.target.value)}>
                      <option>Básico</option>
                      <option>Intermediário</option>
                      <option>Avançado</option>
                      <option>Nativo</option>
                    </select>
                    <Trash2 size={16} style={{ color: '#ff4d4d', cursor: 'pointer' }} onClick={() => removeListItem('languages', idx)} />
                  </div>
                ))}

                {trash.languages.length > 0 && (
                  <div className="trash-restorer">
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ITENS REMOVIDOS (LIXEIRA)</p>
                    {trash.languages.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: '#555' }}>{t.name || '(Sem nome)'}</span>
                        <button onClick={() => restoreFromTrash('languages', idx)} style={{ background: 'none', border: 'none', color: '#bc13fe', cursor: 'pointer', fontSize: '0.75rem' }}>Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hobbies Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#00f3ff', margin: 0 }}>
                  <Heart size={18} /> HOBBIES
                </h3>
                <button onClick={() => addListItem('hobbies', { name: '' })} className="builder-add-btn">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resume.hobbies.map((hobby, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" placeholder="Ex: Fotografia" className="builder-input-sm" value={hobby.name} onChange={(e) => handleListUpdate('hobbies', idx, 'name', e.target.value)} />
                    <Trash2 size={16} style={{ color: '#ff4d4d', cursor: 'pointer' }} onClick={() => removeListItem('hobbies', idx)} />
                  </div>
                ))}

                {trash.hobbies.length > 0 && (
                  <div className="trash-restorer">
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ITENS REMOVIDOS (LIXEIRA)</p>
                    {trash.hobbies.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: '#555' }}>{t.name || '(Sem nome)'}</span>
                        <button onClick={() => restoreFromTrash('hobbies', idx)} style={{ background: 'none', border: 'none', color: '#bc13fe', cursor: 'pointer', fontSize: '0.75rem' }}>Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Divider Bar */}
        <div 
          className="builder-divider no-print"
          data-html2canvas-ignore="true"
          onMouseDown={startResizing}
          style={{ position: 'relative' }}
        >
          <button 
            onClick={() => setIsLocked(!isLocked)}
            title={isLocked ? "Desbloquear barra" : "Travar largura da barra"}
            style={{ 
              position: 'absolute', top: '20px', left: '-15px', width: '30px', height: '30px', 
              borderRadius: '50%', background: isLocked ? '#bc13fe' : '#333', border: '1px solid #444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', 
              cursor: 'pointer', zIndex: 60, boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        </div>


        {/* Print Instructions Overlay */}
        {showPrintHelp && (
          <div className="no-print" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: '2rem',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              background: '#1a1a1a', border: '1px solid #bc13fe', borderRadius: '20px',
              maxWidth: '600px', width: '100%', padding: '2.5rem', position: 'relative',
              boxShadow: '0 20px 50px rgba(188, 19, 254, 0.2)'
            }}>
              <button 
                onClick={() => setShowPrintHelp(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
              </button>
              
              <h2 style={{ color: '#bc13fe', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Printer size={24} /> Configurações para PDF Perfeito
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderLeft: '3px solid #bc13fe', paddingLeft: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'white' }}>1. DESTINO</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Selecione "Salvar como PDF" ou sua impressora instalada.</p>
                </div>
                
                <div style={{ borderLeft: '3px solid #bc13fe', paddingLeft: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'white' }}>2. MARGENS (CRÍTICO)</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Mude de "Padrão" para <strong style={{ color: '#00f3ff' }}>"NENHUMA"</strong>.</p>
                </div>
                
                <div style={{ borderLeft: '3px solid #bc13fe', paddingLeft: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'white' }}>3. GRÁFICOS DE SEGUNDO PLANO</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Marque a caixa <strong style={{ color: '#00f3ff' }}>"Gráficos de segundo plano"</strong> para cores e fotos aparecerem.</p>
                </div>
              </div>

              <button 
                onClick={() => { setShowPrintHelp(false); window.print(); }}
                style={{ 
                  width: '100%', marginTop: '2.5rem', padding: '1rem', background: '#bc13fe', 
                  color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                TUDO PRONTO! IMPRIMIR AGORA
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .builder-input:focus { border-color: #00f3ff; }

        .builder-input-lg {
          width: 100%;
          padding: 1.1rem;
          border-radius: 10px;
          background: #1a1a1a;
          border: 1px solid #333;
          color: white;
          outline: none;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .builder-input-lg:focus { border-color: #bc13fe; background: #222; }
        
        .builder-input-sm {
          width: 100%;
          padding: 0.6rem;
          border-radius: 6px;
          background: #252525;
          border: 1px solid #333;
          color: white;
          outline: none;
          font-size: 0.85rem;
        }
        
        .builder-card {
          position: relative;
          background: #1a1a1a;
          padding: 1.5rem 1rem 1rem;
          border-radius: 8px;
          border: 1px solid #333;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .trash-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #555;
          cursor: pointer;
          transition: color 0.2s;
        }
        .trash-icon:hover { color: #ff4d4d; }
        
        .builder-add-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(0, 243, 255, 0.1);
          border: 1px solid #00f3ff;
          color: #00f3ff;
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .builder-add-btn:hover { background: #00f3ff; color: #000; }
        
        .builder-divider {
          width: 6px;
          background: #1a1a1a;
          border-left: 1px solid #333;
          border-right: 1px solid #333;
          cursor: col-resize;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .builder-divider:hover {
          background: #333;
        }
        .builder-divider::after {
          content: '';
          width: 2px;
          height: 30px;
          background: #555;
          border-radius: 2px;
        }

        .spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 1000px) {
          main { flex-direction: column; }
          section { width: 100% !important; height: auto !important; }
          .builder-divider { display: none; }
        }
      `}</style>
    </div>
  );
}
