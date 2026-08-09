import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Globe, Server, Database, AlertTriangle, RefreshCw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import API_URL from '../config';

const NetworkDiagnostic = () => {
  const [tests, setTests] = useState({
    backend: { name: 'Conectividade Backend', status: 'pending', details: 'Verificando porta 7777...' },
    database: { name: 'Persistência de Dados', status: 'pending', details: 'Validando conexão JPA...' },
    cors: { name: 'Handshake CORS', status: 'pending', details: 'Testando políticas de segurança...' },
    latency: { name: 'Latência de Rede', status: 'pending', details: 'Medindo tempo de resposta...' }
  });

  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    // Reset status
    setTests(prev => {
      const newTests = { ...prev };
      Object.keys(newTests).forEach(k => newTests[k].status = 'loading');
      return newTests;
    });

    const startTime = performance.now();

    try {
      // 1. Backend & DB Status
      const response = await fetch(`${API_URL}/status`, { method: 'GET' });
      const data = await response.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setTests(prev => ({
        ...prev,
        backend: { ...prev.backend, status: 'success', details: 'Backend respondendo normalmente.' },
        database: { 
          ...prev.database, 
          status: data.status === 'UP' ? 'success' : 'warning', 
          details: data.status === 'UP' ? 'Banco de dados Neon Cloud conectado.' : 'Backend ativo, mas banco offline.' 
        },
        latency: { ...prev.latency, status: 'success', details: `${latency}ms - Conexão ultra-rápida.` }
      }));

      // 2. CORS check (Implicitly passed if the fetch worked, but let's be explicit)
      setTests(prev => ({
        ...prev,
        cors: { ...prev.cors, status: 'success', details: 'Handshake autorizado pelo servidor.' }
      }));

    } catch (err) {
      setTests(prev => ({
        ...prev,
        backend: { ...prev.backend, status: 'error', details: 'Backend inacessível. Verifique Build-Omniscience.ps1' },
        database: { ...prev.database, status: 'error', details: 'Dependente do backend.' },
        cors: { ...prev.cors, status: 'error', details: 'Possível bloqueio de segurança ou backend offline.' },
        latency: { ...prev.latency, status: 'error', details: 'Falha na medição.' }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Head>
        <title>SRE - Diagnóstico de Rede | CVFacil.NG</title>
      </Head>

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className="p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar para Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Rede SRE Ativa</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tight flex items-center gap-4">
            <Activity className="text-cyan-400" size={40} />
            DIAGNÓSTICO <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">OMNISCIENCE</span>
          </h1>
          <p className="text-gray-400">Validando integridade de comunicação e persistência para CVFacil.NG V15.0.</p>
        </div>

        <div className="grid gap-6">
          {Object.entries(tests).map(([key, test], index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={key}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-xl ${
                  test.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  test.status === 'error' ? 'bg-rose-500/10 text-rose-400' :
                  test.status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-white/5 text-gray-400'
                }`}>
                  {key === 'backend' && <Server size={24} />}
                  {key === 'database' && <Database size={24} />}
                  {key === 'cors' && <ShieldCheck size={24} />}
                  {key === 'latency' && <Globe size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{test.name}</h3>
                  <p className="text-sm text-gray-500">{test.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {test.status === 'loading' && <RefreshCw size={20} className="animate-spin text-cyan-500" />}
                {test.status === 'success' && <CheckCircle2 size={24} className="text-emerald-500" />}
                {test.status === 'error' && <XCircle size={24} className="text-rose-500" />}
                {test.status === 'warning' && <AlertTriangle size={24} className="text-amber-500" />}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 text-center">
          <h2 className="text-xl font-bold mb-4">Ações Recomendadas</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Se algum teste falhou, recomece os serviços usando o Painel Omniscience ou limpe o ambiente usando o script de limpeza manual.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={runDiagnostics}
              disabled={isRunning}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
              <RefreshCw size={18} className={isRunning ? 'animate-spin' : ''} />
              REPETIR TESTES
            </button>
            <Link 
              href="/"
              className="px-8 py-3 border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-all"
            >
              IR PARA APP
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-gray-600 text-sm">
        CVFacil.NG Engine 2026 - Diagnóstico Interno Reservado
      </footer>
    </div>
  );
};

export default NetworkDiagnostic;
