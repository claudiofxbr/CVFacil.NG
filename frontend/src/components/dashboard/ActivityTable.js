import React from 'react';
import styled from 'styled-components';
import { FileText, Edit3, Download, Trash2 } from 'lucide-react';

const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-glass);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 20px 24px;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: ${props => props.$align || 'left'};
  border-bottom: 1px solid var(--border-glass);
`;

const TableRow = styled.tr`
  border-bottom: ${props => props.$isLast ? 'none' : '1px solid var(--border-glass)'};
  transition: background 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.02); }
`;

const TableCell = styled.td`
  padding: 20px 24px;
  text-align: ${props => props.$align || 'left'};
  font-size: ${props => props.$fontSize || 'inherit'};
  color: ${props => props.$color || 'inherit'};
`;

const ResumeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconBox = styled.div`
  padding: 8px;
  background: rgba(188, 19, 254, 0.1);
  border-radius: 8px;
  color: var(--neon-purple);
`;

const ResumeTitle = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
`;

const ResumeSubtitle = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--border-glass);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    border-color: transparent;
  }
  &.edit:hover { background: var(--accent-primary); color: white; box-shadow: 0 4px 12px rgba(0, 243, 255, 0.3); }
  &.download:hover { background: #00ff88; color: #000; box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3); }
  &.delete:hover { background: #ff4d4d; color: white; box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3); }
`;

export const ActivityTable = ({ resumes, activities, onEdit, onDownload, onDelete }) => {
  const displayedResumes = resumes || activities || [];
  
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Não modificado';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Data inválida';
      
      const now = new Date();
      const diffInMs = now - date;
      const diffInSec = Math.floor(diffInMs / 1000);
      const diffInMin = Math.floor(diffInSec / 60);
      const diffInHours = Math.floor(diffInMin / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSec < 60) return 'Agora mesmo!';
      if (diffInMin < 60) return `Há ${diffInMin} min`;
      if (diffInHours < 24) return `Há ${diffInHours} h`;
      if (diffInDays === 1) return 'Ontem';
      if (diffInDays < 7) return `Há ${diffInDays} dias`;
      
      return date.toLocaleDateString('pt-BR');
    } catch (e) { return 'Recente'; }
  };

  return (
    <TableContainer className="card-premium">
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Documento</TableHeader>
            <TableHeader>Modificado</TableHeader>
            <TableHeader>Visibilidade</TableHeader>
            <TableHeader $align="right">Ações</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {displayedResumes.map((resume, idx) => (
            <TableRow key={resume.id} $isLast={idx === displayedResumes.length - 1}>
              <TableCell>
                <ResumeInfo>
                  <IconBox>
                    <FileText size={18} />
                  </IconBox>
                  <div>
                    <ResumeTitle>{resume.title}</ResumeTitle>
                    <ResumeSubtitle>{resume.templateStyle || 'Modelo Moderno'}</ResumeSubtitle>
                  </div>
                </ResumeInfo>
              </TableCell>
              <TableCell $fontSize="0.85rem" $color="var(--text-secondary)">
                {timeAgo(resume.updatedAt)}
              </TableCell>
              <TableCell>
                <span className={`badge ${resume.isPublic ? 'badge-success' : 'badge-warning'}`}>
                  {resume.isPublic ? 'Público' : 'Privado'}
                </span>
              </TableCell>
              <TableCell $align="right">
                <ActionButtonGroup>
                  <ActionButton 
                    className="edit" 
                    onClick={() => onEdit?.(resume.id)} 
                    title="Editar Currículo"
                  >
                    <Edit3 size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="download" 
                    onClick={() => onDownload?.(resume.id)} 
                    title="Exportar PDF"
                  >
                    <Download size={18} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => onDelete?.(resume.id)} 
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </ActionButton>
                </ActionButtonGroup>
              </TableCell>
            </TableRow>
          ))}
          {displayedResumes.length === 0 && (
            <TableRow>
              <TableCell colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Nenhum currículo encontrado. Vamos começar?
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ActivityTable;
