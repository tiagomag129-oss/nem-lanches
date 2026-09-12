import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCarousel } from '../public/ProductCarousel';
import { ProfileHeader } from '../public/ProfileHeader';
import { MainOrderCTA } from '../public/MainOrderCTA';
import { BioLinkCard } from '../public/BioLinkCard';
import { BusinessInfoSection } from '../public/BusinessInfoSection';
import { PublicFooter } from '../public/PublicFooter';
import { Smartphone, ExternalLink } from 'lucide-react';

interface MobilePreviewProps {
  onOpenSiteTab: () => void;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ onOpenSiteTab }) => {
  const { data, setHoursModalOpen } = useApp();

  const activeLinks = (data.bio_links || [])
    .filter((l) => l.active)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col items-center">
      {/* Top action bar */}
      <div className="w-full max-w-[380px] flex items-center justify-between pb-3 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Smartphone className="w-4 h-4 text-[#E63922]" />
          <span>Pré-visualização Mobile</span>
        </div>
        <button
          type="button"
          onClick={onOpenSiteTab}
          className="inline-flex items-center gap-1 text-[#F5B942] hover:underline font-semibold cursor-pointer"
        >
          <span>Abrir página pública</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative w-[340px] sm:w-[360px] h-[680px] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-[#2b2b2b] ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 border border-white/10 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/20" />
        </div>

        {/* Screen inner container with scroll */}
        <div className="w-full h-full rounded-[36px] bg-[#111111] overflow-y-auto overflow-x-hidden pt-6 pb-8 px-3.5 custom-scrollbar text-white">
          {/* 1. Carousel */}
          <ProductCarousel slides={data.carousel_items || []} />

          {/* 2. Profile */}
          <ProfileHeader profile={data.profile} />

          {/* 3. CTA */}
          <MainOrderCTA
            ctaText={data.profile.cta_text || '🍔 FAÇA SEU PEDIDO'}
            ctaUrl={data.profile.cta_url || 'https://wa.me/5531995176904'}
          />

          {/* 4. Links */}
          <div className="space-y-2 my-2">
            {activeLinks.map((link, idx) => (
              <BioLinkCard
                key={link.id}
                link={link}
                index={idx}
                onOpenHoursModal={() => setHoursModalOpen(true)}
              />
            ))}
          </div>

          {/* 5. Business Info */}
          <BusinessInfoSection business={data.business} />

          {/* 6. Footer */}
          <PublicFooter />
        </div>

        {/* Smartphone Home Indicator bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
