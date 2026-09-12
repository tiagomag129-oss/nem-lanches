import React from 'react';
import { Lock } from 'lucide-react';

interface PublicFooterProps {
  onAdminClick?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onAdminClick }) => {
  return (
    <footer id="public-footer" className="w-full mt-8 pt-6 pb-10 text-center border-t border-white/5">
      <p className="text-xs font-black tracking-wider text-white uppercase">
        NEM LANCHES
      </p>
      <p className="text-[11px] text-[#B8B8B8] mt-1">
        João Monlevade · MG
      </p>
      <p className="text-[10px] text-neutral-600 mt-1">
        Todos os direitos reservados
      </p>

      {/* Discreet admin management button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onAdminClick}
          className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors px-2 py-1 rounded cursor-pointer"
          title="Área Administrativa"
        >
          <Lock className="w-3 h-3" />
          <span>Painel Admin</span>
        </button>
      </div>
    </footer>
  );
};
