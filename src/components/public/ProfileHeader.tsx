import React from 'react';
import { motion } from 'motion/react';
import { Flame, MapPin } from 'lucide-react';
import { ProfileData } from '../../types';
import { NemLanchesLogo } from './NemLanchesLogo';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const isCustomUploadedLogo =
    profile.logo_url &&
    profile.logo_url !== '/images/logo-nem.jpg' &&
    !profile.logo_url.includes('logo-nem');

  return (
    <motion.div
      id="profile-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex flex-col items-center text-center pt-4 pb-3 px-2 w-full"
    >
      {/* Brand Hero Badge with Official Logo */}
      <div className="relative mb-3 group flex items-center justify-center">
        {isCustomUploadedLogo ? (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-b from-[#E53935] via-[#F5B324] to-[#1F1A1D] shadow-xl shadow-black/80">
            <div className="w-full h-full rounded-[22px] bg-[#1F1A1D] border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src={profile.logo_url}
                alt={profile.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.04, rotate: 0.5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="cursor-pointer relative"
          >
            {/* Ambient warm glow behind sticker badge */}
            <div className="absolute inset-0 bg-[#E53935]/25 rounded-3xl blur-xl -z-10 scale-90" />
            <NemLanchesLogo
              size="lg"
              className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] filter"
            />
          </motion.div>
        )}

        {/* Small verified / flame indicator badge */}
        <div
          title="Hamburgueria Artesanal em João Monlevade"
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E53935] border-2 border-[#121012] flex items-center justify-center text-white shadow-lg shadow-[#E53935]/40"
        >
          <Flame className="w-3.5 h-3.5 text-[#F5B324]" />
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
        {profile.name || 'NEM LANCHES'}
      </h1>

      {/* Tagline */}
      {profile.tagline && (
        <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F5B324] tracking-wide">
          <span>{profile.tagline}</span>
        </div>
      )}

      {/* Description */}
      {profile.description && (
        <p className="mt-2 text-xs sm:text-sm text-[#C2B4BA] max-w-sm leading-relaxed">
          {profile.description}
        </p>
      )}

      {/* Mini location pill */}
      <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-300 bg-white/[0.06] border border-white/10 px-3 py-1 rounded-full shadow-sm">
        <MapPin className="w-3 h-3 text-[#E53935]" />
        <span>Planalto · João Monlevade - MG</span>
      </div>
    </motion.div>
  );
};
