import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import API_URL from '../config';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  // Busca automática da foto do usuário (Profile Lookup)
  useEffect(() => {
    if (email && email.includes('@') && email.length > 5) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/auth/profile-lookup?email=${email}`);
          if (response.ok) {
            const data = await response.json();
            setPhotoUrl(data.photoUrl);
          }
        } catch (err) {
          console.error('Erro no lookup de perfil:', err);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setPhotoUrl(null);
    }
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const authData = await response.json();
        login(authData.user);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setErrorMSG(errorData.error || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setErrorMSG('Servidor indisponível no momento. Por favor, tente novamente mais tarde.');
      } else {
        setErrorMSG('Falha na conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white selection:bg-cyan-500/30">
      <Head>
        <title>Acesso Premium | CVFacil.NG</title>
      </Head>

      {/* Lado Esquerdo: Área Artística (Elite Visual) */}
      <div 
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-16 overflow-hidden"
        style={{
          backgroundImage: 'url("/images/login-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/20" />
        
        {/* Logo/Brand */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
              CV
            </div>
            <span className="text-2xl font-bold tracking-tight">Facil<span className="text-cyan-400">.NG</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Seu próximo passo na <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">carreira de elite</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            Crie currículos que impressionam os recrutadores das maiores techs do mercado com nossa inteligência artificial de ponta.
          </p>
        </div>

        {/* Footer info artístico */}
        <div className="relative z-10 flex gap-12 text-sm font-medium text-gray-400">
          <div className="flex flex-col gap-1">
            <span className="text-white">10k+</span>
            <span>Usuários Ativos</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white">500+</span>
            <span>Empresas Parceiras</span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Formulário Premium */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-[#0a0a0c] border-l border-white/5">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
          
          <div className="text-center">
            {/* Foto de Perfil Dinâmica */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1a1a1c] border-2 border-white/10 flex items-center justify-center shadow-2xl">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover animate-in zoom-in-50 duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">Acesse sua área exclusiva para candidatos</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {errorMSG && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-shake">
                {errorMSG}
              </div>
            )}

            <div className="space-y-4">
              <div className="group space-y-2">
                <label className="text-sm font-medium text-gray-400 group-focus-within:text-cyan-400 transition-colors">
                  E-mail institucional
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
                  placeholder="nome@empresa.com"
                />
              </div>

              <div className="group space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-400 group-focus-within:text-cyan-400 transition-colors">
                    Chave de acesso
                  </label>
                  <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0c] px-2 text-gray-500">Ou continue com</span>
            </div>
          </div>

          {/* Social Login (Template pronto para uso se configurado) */}
          <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-medium">Acesso via Google</span>
          </button>

          <p className="text-center text-sm text-gray-500 pt-4">
            Ainda não tem acesso?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Inscreva-se gratuitamente
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
