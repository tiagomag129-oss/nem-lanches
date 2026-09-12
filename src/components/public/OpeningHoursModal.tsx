import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X, MessageCircle, AlertCircle } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface OpeningHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessSettings;
}

export const OpeningHoursModal: React.FC<OpeningHoursModalProps> = ({
  isOpen,
  onClose,
  business,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          id="opening-hours-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-[#1E1E1E] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 text-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar janela de horários"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E63922]/15 border border-[#E63922]/30 flex items-center justify-center text-[#E63922] mb-4">
            <Clock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Horário de Funcionamento
          </h3>

          {/* Main Notice */}
          <div className="my-4 p-4 rounded-2xl bg-[#282828] border border-white/10 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F5B942] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">
                  {business.opening_hours || 'Consulte nossos horários atualizados.'}
                </p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {business.opening_hours_note ||
                    'Os horários podem variar em feriados e dias de eventos. Fale conosco para confirmar o atendimento do dia.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp check */}
          <a
            href={business.whatsapp_url || 'https://wa.me/5531995176904'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E63922] hover:bg-[#d5301a] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar pelo WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
