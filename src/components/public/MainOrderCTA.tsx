import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface MainOrderCTAProps {
  ctaText?: string;
  ctaUrl?: string;
}

export const MainOrderCTA: React.FC<MainOrderCTAProps> = ({
  ctaText = '🍔 FAÇA SEU PEDIDO',
  ctaUrl = 'https://wa.me/5531995176904',
}) => {
  return (
    <motion.div
      id="main-order-cta-container"
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      className="w-full my-3"
    >
      <motion.a
        id="main-order-cta-button"
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2, filter: 'brightness(1.08)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="group relative w-full flex items-center justify-between px-5 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-[#E53935] via-[#EB4C3B] to-[#D32F2F] text-white font-black text-base sm:text-lg shadow-xl shadow-[#E53935]/30 border border-white/25 overflow-hidden cursor-pointer active:shadow-md transition-all"
        aria-label="Fazer pedido pelo WhatsApp da NEM LANCHES"
      >
        {/* Subtle shimmer sweep */}
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Left icon: WhatsApp icon with gentle pulse */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-105 transition-transform duration-200">
            <MessageCircle className="w-5 h-5 fill-white text-[#E53935]" />
          </div>
          <span className="tracking-tight text-white drop-shadow font-black uppercase text-sm sm:text-base">
            {ctaText}
          </span>
        </div>

        {/* Right action indicator */}
        <div className="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center border border-white/20 text-white/95 group-hover:translate-x-1 group-hover:bg-[#F5B324] group-hover:text-black transition-all duration-200">
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.a>
    </motion.div>
  );
};
