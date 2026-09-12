import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CarouselSlide } from '../../types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';

const CATEGORIES = [
  'Hambúrguer',
  'Lanche',
  'Combo',
  'Porção',
  'Bebida',
  'Sobremesa',
  'Sabor & Qualidade',
  'Outro',
];

export const CarouselManager: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, uploadImage, isSaving } = useApp();
  const [slides, setSlides] = useState<CarouselSlide[]>(data.carousel_items || []);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);

  const handleAddSlide = () => {
    const newSlide: CarouselSlide = {
      id: 'slide-' + Date.now(),
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      title: 'Novo Slide',
      category: 'Hambúrguer',
      description: 'Lanche especial da NEM LANCHES',
      alt_text: 'Foto do lanche',
      active: true,
      position: slides.length + 1,
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    updateDataLocally((prev) => ({ ...prev, carousel_items: updated }));
  };

  const handleRemoveSlide = (id: string) => {
    const updated = slides.filter((s) => s.id !== id).map((s, idx) => ({ ...s, position: idx + 1 }));
    setSlides(updated);
    updateDataLocally((prev) => ({ ...prev, carousel_items: updated }));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const withPositions = reordered.map((s, idx) => ({ ...s, position: idx + 1 }));
    setSlides(withPositions);
    updateDataLocally((prev) => ({ ...prev, carousel_items: withPositions }));
  };

  const handleUpdateSlide = (id: string, field: keyof CarouselSlide, value: any) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setSlides(updated);
    updateDataLocally((prev) => ({ ...prev, carousel_items: updated }));
  };

  const handleImageUpload = async (slideId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlideId(slideId);
    const res = await uploadImage(file);
    setUploadingSlideId(null);

    if (res.success && res.url) {
      handleUpdateSlide(slideId, 'image_url', res.url);
      setFeedback({ type: 'success', message: 'Imagem do slide atualizada!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Falha no upload.' });
    }
  };

  const handleSave = async () => {
    setFeedback(null);
    const res = await saveDataToServer({ ...data, carousel_items: slides });
    if (res.success) {
      setFeedback({ type: 'success', message: 'Slides do carrossel salvos com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Gerenciador de Carrossel de Fotos
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Cadastre as fotos dos lanches e hambúrgueres exibidas no carrossel de destaque.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddSlide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#F5B942]" />
            <span>Adicionar Foto / Slide</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white text-xs font-bold shadow cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Ordem'}</span>
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

      {slides.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#1B1B1B] border border-white/10 text-center">
          <p className="text-sm text-neutral-400">Nenhum slide cadastrado no carrossel.</p>
          <button
            type="button"
            onClick={handleAddSlide}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E63922] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Slide</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-5 rounded-2xl bg-[#1B1B1B] border transition-all ${
                slide.active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Image preview & upload */}
                <div className="w-full lg:w-48 shrink-0">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/10 group">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity">
                      <Upload className="w-5 h-5 mb-1" />
                      <span>{uploadingSlideId === slide.id ? 'Enviando...' : 'Trocar Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(slide.id, e)}
                        disabled={uploadingSlideId === slide.id}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Posição #{slide.position}</span>
                    <span className={slide.active ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>
                      {slide.active ? 'Ativo no Carrossel' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Título / Nome do Lanche
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                      placeholder="Ex: Hambúrguer Especial"
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Categoria
                    </label>
                    <select
                      value={slide.category}
                      onChange={(e) => handleUpdateSlide(slide.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Descrição Opcional
                    </label>
                    <input
                      type="text"
                      value={slide.description || ''}
                      onChange={(e) => handleUpdateSlide(slide.id, 'description', e.target.value)}
                      placeholder="Ex: Pão artesanal, carne suculenta e queijo derretido"
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      URL da Imagem (ou use o botão 'Trocar Foto')
                    </label>
                    <input
                      type="text"
                      value={slide.image_url}
                      onChange={(e) => handleUpdateSlide(slide.id, 'image_url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-neutral-300 text-xs font-mono focus:outline-none focus:border-[#E63922]"
                    />
                  </div>
                </div>

                {/* Actions (reorder, toggle active, delete) */}
                <div className="flex lg:flex-col justify-end lg:justify-center items-center gap-1.5 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-4">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateSlide(slide.id, 'active', !slide.active)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      slide.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                    }`}
                    title={slide.active ? 'Desativar do carrossel' : 'Ativar no carrossel'}
                  >
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    title="Excluir slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
