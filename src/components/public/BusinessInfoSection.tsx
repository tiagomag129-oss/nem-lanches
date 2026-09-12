import React from 'react';
import { MapPin, MessageCircle, Instagram, Wallet, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface BusinessInfoSectionProps {
  business: BusinessSettings;
}

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ business }) => {
  return (
    <div
      id="business-info-section"
      className="w-full mt-6 p-5 rounded-3xl bg-[#1E181B] border border-white/10 shadow-lg text-left"
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <h3 className="text-xs font-black tracking-wider uppercase text-[#F5B324]">
          Informações da Hamburgueria
        </h3>
        <span className="text-[11px] font-semibold text-[#C2B4BA] px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
          Oficial
        </span>
      </div>

      <div className="space-y-3.5 text-xs sm:text-sm">
        {/* Location & Address */}
        <a
          href={business.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E53935]/20 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 font-bold text-white group-hover:text-[#F5B324] transition-colors">
              <span>{business.neighborhood} · {business.city}/{business.state}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[#C2B4BA] text-xs mt-0.5 leading-snug">
              {business.address}
            </p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href={business.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] uppercase font-semibold text-neutral-400 block">WhatsApp</span>
            <span className="font-bold text-white group-hover:text-[#25D366] transition-colors">
              {business.phone}
            </span>
          </div>
        </a>

        {/* Instagram */}
        <a
          href={business.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E1306C]/15 text-[#E1306C] flex items-center justify-center shrink-0">
            <Instagram className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] uppercase font-semibold text-neutral-400 block">Instagram</span>
            <span className="font-bold text-white group-hover:text-[#E1306C] transition-colors">
              {business.instagram_handle}
            </span>
          </div>
        </a>

        {/* Price Range Reference */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-[#F5B324]/15 text-[#F5B324] flex items-center justify-center shrink-0 mt-0.5">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] uppercase font-semibold text-neutral-400 block">
              Faixa de preço informada
            </span>
            <span className="font-bold text-white">{business.price_range}</span>
            <p className="text-[11px] text-[#C2B4BA] mt-0.5 leading-snug">
              {business.price_range_note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
