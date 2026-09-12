import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, uploadImage, isSaving } = useApp();
  const [profile, setProfile] = useState(data.profile);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadImage(file);
    setIsUploading(false);

    if (res.success && res.url) {
      handleChange('logo_url', res.url);
      setFeedback({ type: 'success', message: 'Logo atualizada com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Falha ao enviar logo.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const updatedData = { ...data, profile };
    updateDataLocally(() => updatedData);

    const res = await saveDataToServer(updatedData);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Alterações salvas com sucesso.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar alterações.' });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">
          Informações Gerais da NEM LANCHES
        </h2>
        <p className="text-xs text-[#B8B8B8] mt-1">
          Edite a identidade principal exibida no topo da bio link.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#1B1B1B] p-6 rounded-2xl border border-white/10">
        {/* Logo Upload */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-neutral-500">Sem Logo</span>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Logo da Hamburgueria
            </span>
            <p className="text-xs text-neutral-400 mb-2">
              Envie uma imagem quadrada (PNG, JPG ou WebP) para substituir a marca provisória.
            </p>
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors border border-white/10">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Enviando...' : 'Carregar Imagem'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Nome Comercial
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
            required
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Tagline / Slogan
          </label>
          <input
            type="text"
            value={profile.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
            placeholder="Ex: Seu lanche, seu momento."
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Descrição Curta
          </label>
          <textarea
            rows={2}
            value={profile.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
            placeholder="Hambúrgueres e lanches preparados para deixar seu momento ainda mais saboroso."
          />
        </div>

        {/* CTA Principal */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Texto do Botão Principal (CTA)
          </label>
          <input
            type="text"
            value={profile.cta_text}
            onChange={(e) => handleChange('cta_text', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
            required
          />
        </div>

        {/* Link do CTA */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Link do Botão Principal (WhatsApp)
          </label>
          <input
            type="url"
            value={profile.cta_url}
            onChange={(e) => handleChange('cta_url', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Telefone / WhatsApp
          </label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
          />
        </div>

        {/* Instagram URL */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Link do Instagram
          </label>
          <input
            type="url"
            value={profile.instagram_url}
            onChange={(e) => handleChange('instagram_url', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-neutral-300 mb-1.5">
            Endereço Completo
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-white/10 focus:border-[#E63922] rounded-xl text-white text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white font-bold text-sm shadow-lg shadow-[#E63922]/20 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>
    </form>
  );
};
