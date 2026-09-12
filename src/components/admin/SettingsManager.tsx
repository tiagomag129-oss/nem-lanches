import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessSettings } from '../../types';
import { CheckCircle2, AlertCircle, Save, Lock, KeyRound } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, changePassword, isSaving } = useApp();
  const [business, setBusiness] = useState<BusinessSettings>(data.business);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setBusiness((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const updatedData = { ...data, business };
    updateDataLocally(() => updatedData);

    const res = await saveDataToServer(updatedData);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Configurações comerciais e SEO salvas!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (!currentPassword || !newPassword) {
      setPasswordFeedback({ type: 'error', message: 'Informe a senha atual e a nova senha.' });
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setPasswordFeedback({ type: 'success', message: 'Senha administrativa atualizada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordFeedback({ type: 'error', message: res.error || 'Erro ao alterar senha.' });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Configurações Comerciais e SEO
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Dados de canais, horários, localização e otimização para mecanismos de busca.
          </p>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* SEO */}
        <div className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B942] border-b border-white/10 pb-2">
            SEO & Metadados
          </h3>
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Título SEO (Título da Aba do Navegador)
            </label>
            <input
              type="text"
              value={business.seo_title}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Meta Description (Exibido no Google e Compartilhamentos)
            </label>
            <textarea
              rows={2}
              value={business.seo_description}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
            />
          </div>
        </div>

        {/* Business and Channels */}
        <div className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B942] border-b border-white/10 pb-2">
            Canais de Atendimento e Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Número WhatsApp Internacional
              </label>
              <input
                type="text"
                value={business.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="+5531995176904"
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                URL Direta WhatsApp
              </label>
              <input
                type="text"
                value={business.whatsapp_url}
                onChange={(e) => handleChange('whatsapp_url', e.target.value)}
                placeholder="https://wa.me/5531995176904"
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                @ do Instagram
              </label>
              <input
                type="text"
                value={business.instagram_handle}
                onChange={(e) => handleChange('instagram_handle', e.target.value)}
                placeholder="@nem_llanches"
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                URL do Instagram
              </label>
              <input
                type="text"
                value={business.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://www.instagram.com/nem_llanches/"
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Link do Google Maps
              </label>
              <input
                type="text"
                value={business.maps_url}
                onChange={(e) => handleChange('maps_url', e.target.value)}
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Link para Avaliações no Google
              </label>
              <input
                type="text"
                value={business.reviews_url}
                onChange={(e) => handleChange('reviews_url', e.target.value)}
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Price reference */}
        <div className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B942] border-b border-white/10 pb-2">
            Horários & Referência de Preço
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Texto de Horários de Funcionamento
              </label>
              <input
                type="text"
                value={business.opening_hours}
                onChange={(e) => handleChange('opening_hours', e.target.value)}
                placeholder="Consulte nossos horários atualizados."
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Faixa de Preço Estimada
              </label>
              <input
                type="text"
                value={business.price_range}
                onChange={(e) => handleChange('price_range', e.target.value)}
                placeholder="R$ 20–40 por pessoa"
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Nota de Referência
              </label>
              <input
                type="text"
                value={business.price_range_note}
                onChange={(e) => handleChange('price_range_note', e.target.value)}
                className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white font-bold text-sm shadow-lg shadow-[#E63922]/20 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </form>

      {/* Security: Change Admin Password */}
      <form onSubmit={handleChangePassword} className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Lock className="w-4 h-4 text-[#E63922]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Segurança do Painel (Alterar Senha do Administrador)
          </h3>
        </div>

        {passwordFeedback && (
          <div
            className={`p-3.5 rounded-xl flex items-center gap-2 text-xs font-medium border ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {passwordFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{passwordFeedback.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Senha atual"
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Nova Senha (Mínimo 6 caracteres)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha segura"
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isChangingPass}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>{isChangingPass ? 'Atualizando...' : 'Atualizar Senha'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
