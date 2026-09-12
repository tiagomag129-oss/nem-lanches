import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
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
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BioLink, LinkIconType } from '../../types';

interface BioLinkCardProps {
  link: BioLink;
  index: number;
  onOpenHoursModal: () => void;
}

const iconMap: Record<LinkIconType, React.FC<{ className?: string }>> = {
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
};

export const BioLinkCard: React.FC<BioLinkCardProps> = ({
  link,
  index,
  onOpenHoursModal,
}) => {
  const [showNotice, setShowNotice] = useState(false);
  const IconComponent = iconMap[link.icon] || ExternalLink;
  const isHoursModal = link.type === 'hours_modal';
  const hasNoUrl = !link.url && !isHoursModal;

  const handleClick = (e: React.MouseEvent) => {
    if (isHoursModal) {
      e.preventDefault();
      onOpenHoursModal();
      return;
    }

    if (hasNoUrl) {
      e.preventDefault();
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 4000);
    }
  };

  const cardContent = (
    <div className="w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#1E181B] hover:bg-[#282024] border border-white/10 hover:border-[#E53935]/40 transition-all duration-200 shadow-lg hover:shadow-xl text-left relative overflow-hidden group">
      {/* Subtle border shine on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#E53935] transition-colors rounded-l-2xl" />

      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
        {/* Icon box with authentic brand dark espresso + golden cheddar accent */}
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 border ${
            hasNoUrl
              ? 'bg-[#181315] border-white/10 text-[#C2B4BA]'
              : 'bg-[#2A1116] border-[#E53935]/20 text-[#F5B324] group-hover:text-white group-hover:bg-[#E53935] group-hover:border-[#E53935]'
          }`}
        >
          <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate group-hover:text-white transition-colors">
              {link.title}
            </h2>
            {hasNoUrl && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#F5B324]/20 text-[#F5B324] border border-[#F5B324]/30 shrink-0">
                Em atualização
              </span>
            )}
          </div>
          {link.description && (
            <p className="text-xs text-[#C2B4BA] leading-relaxed truncate group-hover:text-white/80 transition-colors mt-0.5">
              {link.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Arrow */}
      <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#E53935] flex items-center justify-center text-neutral-400 group-hover:text-white shrink-0 group-hover:translate-x-1 transition-all duration-200">
        {hasNoUrl ? (
          <Sparkles className="w-3.5 h-3.5 text-[#F5B324]" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      id={`bio-link-${link.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.2 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex flex-col gap-1.5"
    >
      {isHoursModal || hasNoUrl ? (
        <button
          type="button"
          onClick={handleClick}
          className="group w-full block cursor-pointer select-none text-left"
          aria-label={link.title}
        >
          {cardContent}
        </button>
      ) : (
        <a
          href={link.url}
          target={link.openInNewTab !== false ? '_blank' : '_self'}
          rel={link.openInNewTab !== false ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className="group w-full block cursor-pointer select-none text-left"
          aria-label={link.title}
        >
          {cardContent}
        </a>
      )}

      {/* In-card friendly notice when menu is in update phase */}
      {showNotice && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 py-2 rounded-xl bg-[#2A1116] border border-[#E53935]/30 text-xs text-[#F5B324] flex items-center justify-between"
        >
          <span>Cardápio digital em atualização! Peça os itens do dia pelo WhatsApp oficial.</span>
          <a
            href="https://wa.me/5531995176904"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-white hover:text-[#E53935] shrink-0 ml-2"
          >
            Chamar no Zap
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};
