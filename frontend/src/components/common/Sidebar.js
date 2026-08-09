import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Layers, 
  Upload, 
  CreditCard, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Editar Currículos', icon: <FileText size={20} />, path: '/dashboard/resumes' },
    { title: 'Criar Novo Currículo', icon: <PlusCircle size={20} />, path: '/dashboard/create' },
    { title: 'Meus Layouts', icon: <Layers size={20} />, path: '/dashboard/layouts' },
    { title: 'Importar Currículo', icon: <Upload size={20} />, path: '/dashboard/resumes' },
    { title: 'Planos', icon: <CreditCard size={20} />, path: '/dashboard/plans' },
    { title: 'Configurações', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/images/logo.png" 
          alt="XavierBr.Net / CVFacil.NG Logo" 
          style={{ height: '36px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          CVFacil<span style={{ color: 'var(--text-secondary)' }}>.NG</span>
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {menuItems.map((item, idx) => {
          const isActive = router.pathname === item.path;
          return (
            <Link href={item.path} key={idx} style={{ textDecoration: 'none' }}>
              <div className={`nav-item ${isActive ? 'active' : ''}`}>
                {item.icon}
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '24px 12px', borderTop: '1px solid var(--border-glass)' }}>
        <div className="nav-item" onClick={logout}>
          <LogOut size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Sair da conta</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
