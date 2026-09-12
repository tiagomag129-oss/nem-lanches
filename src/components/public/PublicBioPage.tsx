import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCarousel } from './ProductCarousel';
import { ProfileHeader } from './ProfileHeader';
import { MainOrderCTA } from './MainOrderCTA';
import { BioLinkCard } from './BioLinkCard';
import { BusinessInfoSection } from './BusinessInfoSection';
import { PublicFooter } from './PublicFooter';
import { OpeningHoursModal } from './OpeningHoursModal';

interface PublicBioPageProps {
  onNavigateToAdmin: () => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({ onNavigateToAdmin }) => {
  const { data, isHoursModalOpen, setHoursModalOpen } = useApp();

  const activeLinks = (data.bio_links || [])
    .filter((l) => l.active)
    .sort((a, b) => a.position - b.position);

  const bg = data.appearance?.backgroundColor || '#121012';
  const text = data.appearance?.textColor || '#FFFFFF';

  return (
    <div
      id="public-bio-page"
      style={{ backgroundColor: bg, color: text }}
      className="min-h-screen w-full flex justify-center py-4 px-4 sm:py-8 sm:px-6 relative overflow-x-hidden selection:bg-[#E53935] selection:text-white transition-colors duration-300"
    >
      {/* Ambient background glows matching brand palette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-[#E53935]/12 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/3 w-[300px] h-[250px] bg-[#F5B324]/8 blur-[110px] pointer-events-none -z-10" />

      {/* Main Single Column Container (480px to 540px width) */}
      <main className="w-full max-w-[480px] flex flex-col items-center">
        {/* 1. Carousel de produtos */}
        <ProductCarousel slides={data.carousel_items || []} />

        {/* 2. Perfil da NEM LANCHES */}
        <ProfileHeader profile={data.profile} />

        {/* 3. Botão principal de pedido */}
        <MainOrderCTA
          ctaText={data.profile.cta_text || '🍔 FAÇA SEU PEDIDO'}
          ctaUrl={data.profile.cta_url || 'https://wa.me/5531995176904'}
        />

        {/* 4. Links principais */}
        <section
          id="bio-links-list"
          className="w-full space-y-2.5 my-2"
          aria-label="Canais e links da NEM LANCHES"
        >
          {activeLinks.map((link, idx) => (
            <BioLinkCard
              key={link.id}
              link={link}
              index={idx}
              onOpenHoursModal={() => setHoursModalOpen(true)}
            />
          ))}
        </section>

        {/* 5. Informações comerciais compactas */}
        <BusinessInfoSection business={data.business} />

        {/* 6. Rodapé */}
        <PublicFooter onAdminClick={onNavigateToAdmin} />
      </main>

      {/* Opening Hours Modal */}
      <OpeningHoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setHoursModalOpen(false)}
        business={data.business}
      />
    </div>
  );
};
