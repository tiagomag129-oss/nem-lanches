import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NemLanchesLogo } from '../public/NemLanchesLogo';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor, informe a senha de acesso.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div
      id="admin-login-screen"
      className="min-h-screen w-full bg-[#0e0c0e] flex items-center justify-center p-4 selection:bg-[#E53935] selection:text-white relative overflow-hidden"
    >
      {/* Background flare */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E53935]/12 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#1B1619] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao site da NEM LANCHES</span>
        </button>

        {/* Official Logo and title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-2">
            <NemLanchesLogo size="md" className="drop-shadow-lg filter" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Painel Administrativo
          </h1>
          <p className="text-xs text-[#C2B4BA] mt-1">
            Gerenciador oficial da bio link da NEM LANCHES
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha do painel"
                className="w-full pl-10 pr-11 py-3 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#E63922] transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#E63922] hover:bg-[#d02c17] active:scale-[0.98] disabled:opacity-60 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#E63922]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <p className="text-[11px] text-neutral-500">
            Autenticação segura via servidor. Senha inicial configurada: <code className="text-neutral-400 bg-black/40 px-1 py-0.5 rounded font-mono">NemLanches@2025</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
