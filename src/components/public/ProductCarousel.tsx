import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { CarouselSlide } from '../../types';

interface ProductCarouselProps {
  slides: CarouselSlide[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ slides }) => {
  const activeSlides = slides.filter((s) => s.active).sort((a, b) => a.position - b.position);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay every 4 seconds
  useEffect(() => {
    if (total <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, nextSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 45;
      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  if (total === 0) {
    return (
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-[#1B1B1B] border border-white/10 flex flex-col items-center justify-center p-6 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E63922] mb-3">
          <ImageIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-wide">NEM LANCHES</h3>
        <p className="text-sm text-[#B8B8B8] max-w-xs mt-1">
          Espaço reservado para fotos dos nossos hambúrgueres e lanches artesanais.
        </p>
      </div>
    );
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      id="product-carousel"
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-[#1B1B1B] border border-white/10 shadow-2xl group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Carrossel de produtos em destaque"
    >
      {/* Slide Image with scale animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image_url}
            alt={currentSlide.alt_text || currentSlide.title || 'Foto de lanche da NEM LANCHES'}
            className="w-full h-full object-cover object-center"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
          />
          {/* Subtle gradient overlay to enhance contrast without obscuring the food */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Caption */}
      {(currentSlide.title || currentSlide.category) && (
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col items-start">
          {currentSlide.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E53935] text-white tracking-wider uppercase mb-1.5 shadow-md border border-white/20">
              {currentSlide.category}
            </span>
          )}
          {currentSlide.title && (
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h2>
          )}
          {currentSlide.description && (
            <p className="text-xs sm:text-sm text-neutral-200 font-medium line-clamp-1 drop-shadow-sm">
              {currentSlide.description}
            </p>
          )}
        </div>
      )}

      {/* Desktop Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            id="carousel-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E53935] text-white items-center justify-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg cursor-pointer"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            id="carousel-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E53935] text-white items-center justify-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg cursor-pointer"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dot Indicators */}
      {total > 1 && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              id={`carousel-indicator-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1.5 bg-[#F5B324]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
