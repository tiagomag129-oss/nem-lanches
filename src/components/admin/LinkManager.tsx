import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BioLink, LinkIconType } from '../../types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  Utensils,
  BookOpen,
  MessageCircle,
  Instagram,
  MapPin,
  Star,
  Clock,
  Phone,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

const AVAILABLE_ICONS: LinkIconType[] = [
  'Utensils',
  'BookOpen',
  'MessageCircle',
  'Instagram',
  'MapPin',
  'Star',
  'Clock',
  'Phone',
  'ShoppingBag',
  'ExternalLink',
];

const iconComponentMap: Record<LinkIconType, React.FC<{ className?: string }>> = {
  Utensils,
  BookOpen,
  MessageCircle,
  Instagram,
  MapPin,
  Star,
  Clock,
  Phone,
  ShoppingBag,
  ExternalLink,
};

export const LinkManager: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, isSaving } = useApp();
  const [links, setLinks] = useState<BioLink[]>(data.bio_links || []);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddLink = () => {
    const newLink: BioLink = {
      id: 'link-' + Date.now(),
      icon: 'ExternalLink',
      title: 'Novo Link',
      description: 'Descrição breve do canal',
      url: 'https://',
      type: 'link',
      active: true,
      position: links.length + 1,
      openInNewTab: true,
    };
    const updated = [...links, newLink];
    setLinks(updated);
    updateDataLocally((prev) => ({ ...prev, bio_links: updated }));
  };

  const handleRemoveLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id).map((l, idx) => ({ ...l, position: idx + 1 }));
    setLinks(updated);
    updateDataLocally((prev) => ({ ...prev, bio_links: updated }));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const withPositions = reordered.map((l, idx) => ({ ...l, position: idx + 1 }));
    setLinks(withPositions);
    updateDataLocally((prev) => ({ ...prev, bio_links: withPositions }));
  };

  const handleUpdate = (id: string, field: keyof BioLink, value: any) => {
    const updated = links.map((l) => (l.id === id ? { ...l, [field]: value } : l));
    setLinks(updated);
    updateDataLocally((prev) => ({ ...prev, bio_links: updated }));
  };

  const handleSave = async () => {
    setFeedback(null);
    const res = await saveDataToServer({ ...data, bio_links: links });
    if (res.success) {
      setFeedback({ type: 'success', message: 'Links da bio salvos com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Gerenciador de Links da Bio
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Organize os botões principais de acesso (Cardápio, WhatsApp, Instagram, Como Chegar, etc).
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#F5B942]" />
            <span>Adicionar Link</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white text-xs font-bold shadow cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Links'}</span>
          </button>
        </div>
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

      <div className="space-y-3.5">
        {links.map((link, index) => {
          const IconComp = iconComponentMap[link.icon] || ExternalLink;
          return (
            <div
              key={link.id}
              className={`p-4 sm:p-5 rounded-2xl bg-[#1B1B1B] border transition-all ${
                link.active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon Selector Box */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#242424] border border-white/10 flex items-center justify-center text-[#F5B942]">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-0.5">
                      Ícone
                    </label>
                    <select
                      value={link.icon}
                      onChange={(e) => handleUpdate(link.id, 'icon', e.target.value as LinkIconType)}
                      className="px-2 py-1 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                      Título do Card
                    </label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleUpdate(link.id, 'title', e.target.value)}
                      placeholder="Título"
                      className="w-full px-3 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={link.description}
                      onChange={(e) => handleUpdate(link.id, 'description', e.target.value)}
                      placeholder="Descrição curta"
                      className="w-full px-3 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                      URL de Destino {link.type === 'hours_modal' && '(Abre modal de horários)'}
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdate(link.id, 'url', e.target.value)}
                      placeholder={link.type === 'hours_modal' ? '#horarios (abre modal)' : 'https://...'}
                      className="w-full px-3 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-neutral-300 text-xs font-mono focus:outline-none focus:border-[#E63922]"
                    />
                  </div>
                </div>

                {/* Quick Toggles and Reorder */}
                <div className="flex md:flex-col items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-4 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
                      title="Mover acima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === links.length - 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
                      title="Mover abaixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdate(link.id, 'active', !link.active)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        link.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                      }`}
                      title={link.active ? 'Link visível' : 'Link oculto'}
                    >
                      {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Excluir link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
