import styled from 'styled-components';

// Layout Components
export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-deep);
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 1400px;
  width: 100%;
`;

export const SectionTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
  background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

export const PrimaryButton = styled.button`
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 243, 255, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 243, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-glass);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: transparent;
  }
  &.edit:hover { background: var(--neon-purple); color: white; }
  &.download:hover { background: var(--neon-cyan); color: white; }
  &.delete:hover { background: #ff4d4d; color: white; }
`;
