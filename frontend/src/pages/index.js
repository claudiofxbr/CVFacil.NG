import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Shield, Zap, Layout as LayoutIcon, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import API_URL from '../config';

const LandingPage = () => {
  const [apiStatus, setApiStatus] = useState('checking'); // checking, online, offline

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('cvfacil_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('cvfacil_user');
      }
    }

    const checkStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Usar a URL base correta (sem /api para o root se necessário, ou /api para o endpoint)
        const response = await fetch(`${API_URL}/public/status`, { 
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
        setApiStatus('offline');
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Head>
        <title>CVFacil.NG - Excelência Profissional</title>
        <meta name="description" content="A evolução definitiva na criação de currículos profissionais." />
      </Head>

      <Navbar />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* API Status Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className={`px-4 py-2 rounded-full border backdrop-blur-xl flex items-center gap-3 transition-all duration-500 shadow-lg ${
            apiStatus === 'online' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
            apiStatus === 'offline' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' :
            'border-white/10 bg-white/5 text-gray-400'
          }`}>
            <AnimatePresence mode="wait">
              {apiStatus === 'online' ? (
                <motion.div key="on" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                  <CheckCircle size={16} />
                </motion.div>
              ) : apiStatus === 'offline' ? (
                <motion.div key="off" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                  <AlertCircle size={16} />
                </motion.div>
              ) : (
                <motion.div key="load" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 size={16} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-xs font-bold tracking-widest uppercase">
              SISTEMA {apiStatus === 'online' ? 'CONECTADO' : apiStatus === 'offline' ? 'BACKEND OFFLINE' : 'VERIFICANDO'}
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">EXCELÊNCIA EM</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">CURRÍCULOS NG</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            A plataforma definitiva para profissionais de alta performance. 
            Designs premium, persistência em nuvem Neon e automação total com CVFacil.NG V15.0.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/login"} className={`group relative px-10 py-5 bg-cyan-500 rounded-2xl font-black text-black tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 ${apiStatus !== 'online' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-3">
                {user ? 'IR PARA O PAINEL' : 'ACESSAR MINHA CONTA'} <Rocket size={20} className="animate-bounce" />
              </span>
            </Link>
            
            {apiStatus === 'offline' && (
              <p className="text-rose-400 text-sm animate-pulse flex items-center gap-2">
                <AlertCircle size={14} /> Execute o script 'Build-Omniscience.ps1' (Opção 6) primeiro.
              </p>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="text-cyan-400" />}
            title="Nuvem Neon Cloud"
            desc="Seus currículos agora são salvos com segurança na nuvem Neon. Seus dados estão sempre acessíveis e isolados."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="Alta Performance"
            desc="Arquitetura otimizada para carregamento instantâneo. O sistema monitora o status do backend em tempo real."
            highlight
          />
          <FeatureCard 
            icon={<LayoutIcon className="text-purple-400" />}
            title="Design Premium"
            desc="Layouts profissionais desenhados para impressionar recrutadores. Designs exclusivos e customizáveis."
          />
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          {/* Logo in Footer */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="XavierBr.Net / CVFacil.NG Logo" 
              className="h-12 w-auto rounded-lg object-contain"
            />
            <span className="text-xl font-extrabold text-white tracking-tight">
              CVFacil<span className="text-purple-400">.NG</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 grayscale opacity-50 font-mono text-xs">
            <CheckCircle size={12} /> INFRAESTRUTURA VERIFICADA
            <span className="mx-2">|</span>
            NEON_CLOUD: ATIVA
          </div>

          <p className="text-gray-500 text-sm">
            © 2026 CVFacil.NG - Desenvolvido por <span className="text-white font-bold">XavierBr.Net</span> & <span className="text-white font-bold">Unifacs Engenharia</span>
          </p>
        </div>
      </footer>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1d; }
        ::-webkit-scrollbar-thumb { background: #164e63; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #0891b2; }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, highlight }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`p-10 rounded-3xl border transition-all duration-500 ${
      highlight 
        ? 'bg-cyan-500/5 border-cyan-500/20 shadow-[0_10px_40px_-15px_rgba(6,182,212,0.2)]' 
        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
    }`}
  >
    <div className="mb-6 p-3 bg-white/5 inline-block rounded-2xl">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </motion.div>
);

export default LandingPage;
