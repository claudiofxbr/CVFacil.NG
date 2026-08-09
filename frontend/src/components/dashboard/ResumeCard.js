import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Trash2, Share2, RotateCcw, XCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import API_URL from '../../config';

export default function ResumeCard({ resume, isTrash, onAction }) {
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('Deseja mover este currículo para a lixeira?')) {
      try {
        const res = await fetch(`${API_URL}/resumes/${resume.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (res.ok) {
          onAction && onAction();
        } else {
          alert('Erro ao excluir currículo.');
        }
      } catch (error) {
        alert('Erro de conexão ao tentar excluir.');
      }
    }
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const res = await fetch(`${API_URL}/resumes/${resume.id}/restore`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        onAction && onAction();
      } else {
        alert('Erro ao restaurar currículo.');
      }
    } catch (error) {
      alert('Erro de conexão ao tentar restaurar.');
    }
  };

  const handleHardDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('TEM CERTEZA? Esta ação excluirá os dados permanentemente do banco de dados e não poderá ser desfeita.')) {
      try {
        const res = await fetch(`${API_URL}/resumes/${resume.id}/hard`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (res.ok) {
          onAction && onAction();
        } else {
          alert('Erro ao excluir permanentemente.');
        }
      } catch (error) {
        alert('Erro de conexão.');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/resume/builder/${resume.id}`);
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    router.push(`/resume/preview/${resume.id}`);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-panel"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}
      onClick={handleEdit}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ background: isTrash ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 242, 255, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
          <FileText className={isTrash ? '' : 'neon-text-purple'} size={28} style={{ color: isTrash ? '#ff4d4d' : undefined }} />
        </div>
        {!isTrash && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Share2 size={18} style={{ cursor: 'pointer', color: '#888' }} onClick={(e) => { e.stopPropagation(); alert('Link público copiado!'); }} />
            <Trash2 size={18} style={{ cursor: 'pointer', color: '#ff4d4d' }} onClick={handleDelete} />
          </div>
        )}
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{resume.title || 'Novo Currículo'}</h3>
        <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
          Atualizado em {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'recentemente'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {!isTrash ? (
          <>
            <div 
              onClick={handleEdit}
              style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                alignItems: 'center', 
                color: '#00f3ff', 
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              <Edit size={16} /> Editar
            </div>

            <div 
              onClick={handlePreview}
              style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                alignItems: 'center', 
                color: '#bc13fe', 
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              <FileText size={16} /> Preview
            </div>
          </>
        ) : (
          <>
            <div 
              onClick={handleRestore}
              style={{ 
                display: 'flex', 
                gap: '0.4rem', 
                alignItems: 'center', 
                color: '#4ade80', 
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
            >
              <RotateCcw size={14} /> Restaurar
            </div>

            <div 
              onClick={handleHardDelete}
              style={{ 
                display: 'flex', 
                gap: '0.4rem', 
                alignItems: 'center', 
                color: '#ff4d4d', 
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
            >
              <XCircle size={14} /> Excluir Definitivo
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
