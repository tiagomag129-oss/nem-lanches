import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileEditor } from './ProfileEditor';
import { CarouselManager } from './CarouselManager';
import { ProductManager } from './ProductManager';
import { LinkManager } from './LinkManager';
import { AppearanceSettings } from './AppearanceSettings';
import { SettingsManager } from './SettingsManager';
import { MobilePreview } from './MobilePreview';
import { NemLanchesLogo } from '../public/NemLanchesLogo';
import {
  Sliders,
  Images,
  ShoppingBag,
  Link2,
  Palette,
  Settings,
  ExternalLink,
  LogOut,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

type TabKey = 'geral' | 'carrossel' | 'produtos' | 'links' | 'aparencia' | 'configuracoes';

interface AdminDashboardProps {
  onNavigateToPublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToPublic }) => {
  const { logout, data } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('geral');
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);

  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'geral', label: 'Geral', icon: Sliders },
    { key: 'carrossel', label: 'Carrossel', icon: Images },
    { key: 'produtos', label: 'Produtos', icon: ShoppingBag },
    { key: 'links', label: 'Links', icon: Link2 },
    { key: 'aparencia', label: 'Aparência', icon: Palette },
    { key: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-[#0e0c0e] text-white flex flex-col selection:bg-[#E53935] selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-[#161214] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 flex items-center justify-center">
            <NemLanchesLogo size="sm" width={75} height={42} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-tight">
                {data.profile.name || 'NEM LANCHES'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-[10px] text-[#C2B4BA] hidden sm:block">
              Painel de Gestão da Bio Link & Cardápio
            </p>
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile screen preview toggle for smaller screens */}
          <button
            type="button"
            onClick={() => setShowMobilePreviewModal(!showMobilePreviewModal)}
            className="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#F5B324]" />
            <span>Preview</span>
          </button>

          {/* View site button */}
          <button
            type="button"
            onClick={onNavigateToPublic}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <span>Ver Bio Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F5B324]" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
            title="Sair do painel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar / Tabs */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#E53935] text-white shadow-md shadow-[#E53935]/25'
                      : 'bg-[#1C1719] text-neutral-300 hover:bg-[#251F22] hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F5B324]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 min-w-0">
          {activeTab === 'geral' && <ProfileEditor />}
          {activeTab === 'carrossel' && <CarouselManager />}
          {activeTab === 'produtos' && <ProductManager />}
          {activeTab === 'links' && <LinkManager />}
          {activeTab === 'aparencia' && <AppearanceSettings />}
          {activeTab === 'configuracoes' && <SettingsManager />}
        </main>

        {/* Desktop Live Smartphone Preview Pane */}
        <div className="hidden xl:block w-[380px] shrink-0 sticky top-24 self-start">
          <MobilePreview onOpenSiteTab={onNavigateToPublic} />
        </div>
      </div>

      {/* Mobile Preview Modal for Tablets/Phones */}
      {showMobilePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 xl:hidden">
          <div className="relative max-w-sm w-full">
            <button
              type="button"
              onClick={() => setShowMobilePreviewModal(false)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full cursor-pointer"
            >
              Fechar Preview ✕
            </button>
            <MobilePreview onOpenSiteTab={onNavigateToPublic} />
          </div>
        </div>
      )}
    </div>
  );
};
