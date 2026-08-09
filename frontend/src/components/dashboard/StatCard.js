import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: ${props => props.$isAction ? 'column' : 'row'};
  align-items: center;
  justify-content: ${props => props.$isAction ? 'center' : 'flex-start'};
  gap: 24px;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  flex: 1;
  min-width: 280px;
  height: 240px;
  border-style: ${props => props.$isAction ? 'dashed' : 'solid'};
  background: ${props => props.$isAction ? 'transparent' : 'var(--bg-card)'};
  border-radius: 20px;
  border: 1px solid var(--border-glass);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-5px);
    background: ${props => props.$isAction ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)'};
    border-color: var(--neon-purple);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(188, 19, 254, 0.2);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isAction ? 'var(--text-secondary)' : 'var(--neon-purple)'};
  transition: transform 0.3s;

  ${CardContainer}:hover & {
    transform: scale(1.1) rotate(5deg);
    color: var(--neon-cyan);
  }
`;

const CardContent = styled.div`
  text-align: ${props => props.$isAction ? 'center' : 'left'};
`;

const ValueText = styled.h3`
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -1px;
`;

const TitleText = styled.p`
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const LabelText = styled.p`
  margin: 12px 0 0 0;
  font-size: 0.85rem;
  color: var(--neon-cyan);
  cursor: pointer;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

export const StatCard = ({ title, value, label, icon, onClick, type = 'default' }) => {
  const isAction = type === 'action';
  
  return (
    <CardContainer 
      className={`card-premium ${isAction ? 'neon-border-purple' : ''}`} 
      onClick={onClick}
      $isAction={isAction}
    >
      <IconWrapper $isAction={isAction}>
        {icon}
      </IconWrapper>
      
      <CardContent $isAction={isAction}>
        <ValueText>{value}</ValueText>
        <TitleText>{title}</TitleText>
        {label && <LabelText>{label}</LabelText>}
      </CardContent>
    </CardContainer>
  );
};

export default StatCard;
