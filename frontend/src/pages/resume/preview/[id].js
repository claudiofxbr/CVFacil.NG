import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, Printer } from 'lucide-react';
import Navbar from '../../../components/common/Navbar';
import ThemeEngine from '../../../components/resume/ThemeEngine';
import API_URL from '../../../config';

export default function ResumePreview() {
  const router = useRouter();
  const { id } = router.query;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/resumes/${id}`)
        .then(res => res.json())
        .then(data => {
          setResume(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Carregando Visualização...</div>;
  if (!resume) return <div style={{ color: 'white', padding: '2rem' }}>Currículo não encontrado.</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Head>
        <title>Preview | {resume.title}</title>
      </Head>
      <Navbar />

      <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }} className="no-print">
          <button 
            onClick={() => router.back()} 
            className="glass-panel" 
            style={{ 
              padding: '0.5rem 1rem', 
              color: 'white', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }} />
          <button 
            onClick={() => window.print()} 
            className="glass-panel neon-border-cyan" 
            style={{ 
              padding: '0.6rem 1.5rem', 
              color: 'white', 
              display: 'flex', 
              gap: '0.5rem', 
              alignItems: 'center', 
              cursor: 'pointer',
              background: 'rgba(0, 243, 255, 0.1)',
              border: '1px solid #00f3ff',
              borderRadius: '12px'
            }}
          >
            <Printer size={18} /> Imprimir / PDF
          </button>
        </div>

        {/* Dynamic Content via ThemeEngine */}
        <div style={{ boxShadow: '0 0 50px rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
          <ThemeEngine resume={resume} layoutId={resume.layoutId} />
        </div>
      </main>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0mm !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 210mm !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #__next {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            overflow: visible !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 210mm !important;
            display: block !important;
            background: white !important;
            overflow: visible !important;
          }

          /* Centralização absoluta do container e remoção de sombras */
          .resume-container {
            margin: 0 auto !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            display: flex !important;
            position: relative !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: visible !important;
            border: none !important;
          }

          /* Forçar sidebar a preencher toda a altura da folha */
          .sidebar {
            min-height: 297mm !important;
            height: auto !important;
          }

          /* Garantir carregamento e exibição de fotos */
          .resume-container img {
            max-width: none !important;
            display: block !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* Forçar cores de fundo em todos os elementos */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Garantir que o texto apareça com alta fidelidade e evitar quebras no meio do elemento */
          p, span, div, h1, h2, h3, h4, li {
            position: relative;
            z-index: 5 !important;
          }

          .section, .item {
            page-break-inside: avoid !important;
          }

          /* Ocultar elementos desnecessários */
          nav, .no-print, button, footer, .navbar, .glass-panel {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
