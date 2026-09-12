import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  ShoppingBag,
} from 'lucide-react';

const PRODUCT_CATEGORIES = [
  'Hambúrgueres',
  'Smash Burgers',
  'Lanches',
  'Combos',
  'Porções e Batatas',
  'Bebidas',
  'Sobremesas',
  'Adicionais',
  'Outro',
];

export const ProductManager: React.FC = () => {
  const { data, updateDataLocally, saveDataToServer, uploadImage, isSaving } = useApp();
  const [products, setProducts] = useState<Product[]>(data.products || []);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: '',
      image_url: '',
      category: 'Hambúrgueres',
      description: '',
      price: '',
      link_url: '',
      active: true,
      position: products.length + 1,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    updateDataLocally((prev) => ({ ...prev, products: updated }));
  };

  const handleRemoveProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id).map((p, idx) => ({ ...p, position: idx + 1 }));
    setProducts(updated);
    updateDataLocally((prev) => ({ ...prev, products: updated }));
  };

  const handleUpdateProduct = (id: string, field: keyof Product, value: any) => {
    const updated = products.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setProducts(updated);
    updateDataLocally((prev) => ({ ...prev, products: updated }));
  };

  const handleImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProductId(productId);
    const res = await uploadImage(file);
    setUploadingProductId(null);

    if (res.success && res.url) {
      handleUpdateProduct(productId, 'image_url', res.url);
      setFeedback({ type: 'success', message: 'Foto do produto enviada!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro no upload.' });
    }
  };

  const handleSave = async () => {
    setFeedback(null);
    const res = await saveDataToServer({ ...data, products });
    if (res.success) {
      setFeedback({ type: 'success', message: 'Lista de produtos salva com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Cadastro de Produtos e Cardápio
          </h2>
          <p className="text-xs text-[#B8B8B8] mt-1">
            Cadastre os itens reais do cardápio da NEM LANCHES com foto, descrição e preço.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddProduct}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#F5B942]" />
            <span>Novo Produto</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white text-xs font-bold shadow cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Produtos'}</span>
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

      {products.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#1B1B1B] border border-white/10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5B942] mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum produto cadastrado ainda</h3>
          <p className="text-xs text-[#B8B8B8] max-w-sm mt-1 mb-4">
            Em conformidade com as diretrizes oficiais, nenhum produto fictício foi gerado automaticamente. Clique abaixo para cadastrar os produtos reais da NEM LANCHES.
          </p>
          <button
            type="button"
            onClick={handleAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63922] hover:bg-[#d02c17] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Produto</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-5 rounded-2xl bg-[#1B1B1B] border transition-all ${
                product.active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Photo upload */}
                <div className="w-full lg:w-44 shrink-0">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/10 group flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name || 'Produto'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-neutral-500 font-medium">Sem foto</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity">
                      <Upload className="w-5 h-5 mb-1" />
                      <span>{uploadingProductId === product.id ? 'Enviando...' : 'Carregar Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(product.id, e)}
                        disabled={uploadingProductId === product.id}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                      placeholder="Ex: Nome oficial do lanche"
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Categoria
                    </label>
                    <select
                      value={product.category}
                      onChange={(e) => handleUpdateProduct(product.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Descrição dos Ingredientes / Detalhes
                    </label>
                    <textarea
                      rows={2}
                      value={product.description}
                      onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)}
                      placeholder="Ex: Pão brioche, hambúrguer 160g, queijo cheddar, maionese especial da casa..."
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Preço (Opcional)
                    </label>
                    <input
                      type="text"
                      value={product.price || ''}
                      onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)}
                      placeholder="Ex: R$ 28,00"
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#E63922]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Link Direto do Pedido no WhatsApp (Opcional)
                    </label>
                    <input
                      type="text"
                      value={product.link_url || ''}
                      onChange={(e) => handleUpdateProduct(product.id, 'link_url', e.target.value)}
                      placeholder="https://wa.me/5531995176904?text=Quero%20pedir..."
                      className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-neutral-300 text-xs font-mono focus:outline-none focus:border-[#E63922]"
                    />
                  </div>
                </div>

                {/* Status & Delete */}
                <div className="flex lg:flex-col justify-end lg:justify-center items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-4">
                  <button
                    type="button"
                    onClick={() => handleUpdateProduct(product.id, 'active', !product.active)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      product.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                    }`}
                    title={product.active ? 'Produto Ativo' : 'Produto Inativo'}
                  >
                    {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    title="Excluir produto"
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
