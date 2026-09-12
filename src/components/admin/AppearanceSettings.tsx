import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppearanceSettings as AppearanceType } from '../../types';
import { initialAppData } from '../../defaultData';
import { RotateCcw, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, isSaving } = useApp();
  const [appearance, setAppearance] = useState<AppearanceType>(data.appearance || initialAppData.appearance);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (field: keyof AppearanceType, value: any) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
  };

  const handleRestoreOriginal = () => {
    const original = initialAppData.appearance;
    setAppearance(original);
    updateDataLocally((prev) => ({ ...prev, appearance: original }));
    setFeedback({
      type: 'success',
      message: 'Identidade visual original restaurada com sucesso!',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const updatedData = { ...data, appearance };
    updateDataLocally(() => updatedData);

    const res = await saveDataToServer(updatedData);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Aparência salva com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar.' });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Personalização de Aparência
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Controle de cores gastronômicas, arredondamentos e estilo da identidade visual.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRestoreOriginal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F5B942]" />
          <span>Restaurar Identidade Original</span>
        </button>
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

      {/* Color Grid */}
      <div className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 border-b border-white/10 pb-2">
          Paleta de Cores da Hamburgueria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cor Principal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <div>
              <span className="block text-xs font-bold text-white">Cor Principal (Destaque/CTA)</span>
              <span className="text-[11px] text-neutral-400 font-mono">{appearance.primaryColor}</span>
            </div>
            <input
              type="color"
              value={appearance.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
            />
          </div>

          {/* Cor Secundária / Dourado */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <div>
              <span className="block text-xs font-bold text-white">Cor Secundária (Dourado/Acentos)</span>
              <span className="text-[11px] text-neutral-400 font-mono">{appearance.secondaryColor}</span>
            </div>
            <input
              type="color"
              value={appearance.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
            />
          </div>

          {/* Fundo Principal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <div>
              <span className="block text-xs font-bold text-white">Fundo da Página</span>
              <span className="text-[11px] text-neutral-400 font-mono">{appearance.backgroundColor}</span>
            </div>
            <input
              type="color"
              value={appearance.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
            />
          </div>

          {/* Cor dos Cards */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <div>
              <span className="block text-xs font-bold text-white">Fundo dos Cards</span>
              <span className="text-[11px] text-neutral-400 font-mono">{appearance.cardColor}</span>
            </div>
            <input
              type="color"
              value={appearance.cardColor}
              onChange={(e) => handleChange('cardColor', e.target.value)}
              className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Shapes and Rounding */}
      <div className="bg-[#1B1B1B] p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 border-b border-white/10 pb-2">
          Estilo dos Elementos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Arredondamento dos Cards
            </label>
            <select
              value={appearance.cardRadius}
              onChange={(e) => handleChange('cardRadius', e.target.value)}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E63922]"
            >
              <option value="rounded-xl">Suave (12px)</option>
              <option value="rounded-2xl">Moderno Padrão (16px)</option>
              <option value="rounded-3xl">Amplo (24px)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Estilo dos Botões
            </label>
            <select
              value={appearance.buttonStyle}
              onChange={(e) => handleChange('buttonStyle', e.target.value)}
              className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E53935]"
            >
              <option value="rounded-2xl">Arredondado Moderno (16px)</option>
              <option value="rounded-xl">Cantos Suaves (12px)</option>
              <option value="rounded-full">Pill / Totalmente Redondo</option>
            </select>
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
          <span>{isSaving ? 'Salvando...' : 'Salvar Aparência'}</span>
        </button>
      </div>
    </form>
  );
};
