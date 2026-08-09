import React from 'react';
import API_URL from '../../config';

// Import dos novos templates premium
import AcademicSleek from './templates/AcademicSleek';
import ModernTech from './templates/ModernTech';
import MinimalistVertical from './templates/MinimalistVertical';
import CreativeGrid from './templates/CreativeGrid';
import ExecutiveClassical from './templates/ExecutiveClassical';
import TechStartup from './templates/TechStartup';
import TimelineElegant from './templates/TimelineElegant';
import ArtisticFocus from './templates/ArtisticFocus';
import SimpleClean from './templates/SimpleClean';

const themes = {
  'academic-sleek': {
    template: AcademicSleek,
    bg: '#ffffff',
    primary: '#1a1a1a',
    secondary: '#555555',
    text: '#2d3436',
    accent: '#f1f2f6'
  },
  'modern-tech': {
    template: ModernTech,
    bg: '#0a0a0a',
    sidebar: '#141414',
    primary: '#00ff88',
    secondary: '#ecfdf5',
    text: '#ffffff',
    accent: '#114433'
  },
  'minimalist-vertical': {
    template: MinimalistVertical,
    bg: '#ffffff',
    primary: '#000000',
    secondary: '#666666',
    text: '#1a1a1a',
    accent: '#eeeeee'
  },
  'creative-grid': {
    template: CreativeGrid,
    bg: '#0f172a',
    primary: '#bc13fe',
    secondary: '#00f3ff',
    text: '#ffffff',
    accent: '#300060'
  },
  'executive-classical': {
    template: ExecutiveClassical,
    bg: '#ffffff',
    primary: '#1e293b',
    secondary: '#475569',
    text: '#334155',
    accent: '#f8fafc'
  },
  'tech-startup': {
    template: TechStartup,
    bg: '#f8fafc',
    primary: '#3b82f6',
    secondary: '#1e40af',
    text: '#1e293b',
    accent: '#dbeafe'
  },
  'timeline-elegant': {
    template: TimelineElegant,
    bg: '#ffffff',
    primary: '#333333',
    secondary: '#777777',
    text: '#222222',
    accent: '#eeeeee'
  },
  'artistic-focus': {
    template: ArtisticFocus,
    bg: '#111111',
    primary: '#ff3e00',
    secondary: '#ffffff',
    text: '#ffffff',
    accent: '#333333'
  },
  'simple-clean': {
    template: SimpleClean,
    bg: '#ffffff',
    primary: '#2d3436',
    secondary: '#636e72',
    text: '#2d3436',
    accent: '#dfe6e9'
  }
};

// Map das cores legadas para os novos temas para evitar quebra de currículos existentes
const legacyMap = {
  'dark-blue': 'modern-tech',
  'black': 'artistic-focus',
  'dark-green': 'modern-tech',
  'dark-yellow': 'creative-grid',
  'dark-red': 'artistic-focus',
  'dark-gray': 'tech-startup',
  'white': 'simple-clean',
  'dark-purple': 'creative-grid',
  'magenta': 'creative-grid'
};

export default function ThemeEngine({ resume, layoutId = 'academic-sleek', id }) {
  // Resolver layout ID (suporte a legados)
  const resolvedId = legacyMap[layoutId] || layoutId;
  const baseTheme = themes[resolvedId] || themes['academic-sleek'];
  const Template = baseTheme.template;
  
  if (!resume) return <div style={{ color: 'white', padding: '20px' }}>Nenhum dado para exibir</div>;

  // Customização de cores dinâmica
  const theme = {
    ...baseTheme,
    primary: resume?.primaryColor || baseTheme.primary,
    secondary: resume?.secondaryColor || baseTheme.secondary,
    bg: resume?.bgColor || baseTheme.bg,
    text: resume?.textColor || baseTheme.text,
  };

  const getPhotoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.includes('/api/storage/files/')) return url;
    return `${API_URL}/storage/files/${url}`;
  };

  return (
    <div id={id} className="resume-print-wrapper" style={{
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      position: 'relative',
      overflow: 'visible',
      boxSizing: 'border-box',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact'
    }}>
      <Template 
        resume={resume} 
        theme={theme} 
        getPhotoUrl={getPhotoUrl} 
      />

      {/* Font Imports - Forçado aqui para garantir carregamento no editor e print */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=Outfit:wght@400;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Public+Sans:wght@400;600;700;800&family=Montserrat:wght@400;700;900&display=swap');
        
        .resume-print-wrapper * {
          box-sizing: border-box;
        }

        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
          }
          .resume-print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
