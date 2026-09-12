import React from 'react';

interface NemLanchesLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  width?: number | string;
  height?: number | string;
  badgeStyle?: boolean;
}

/**
 * Componente oficial do Logo da NEM LANCHES reproduzido fielmente
 * a partir da identidade visual da marca (formato sticker com hambúrguer artesanal,
 * texto NEM em vermelho vibrante e LANCHES em marrom escuro sobre contorno branco).
 */
export const NemLanchesLogo: React.FC<NemLanchesLogoProps> = ({
  className = '',
  size = 'md',
  width,
  height,
  badgeStyle = true,
}) => {
  // Dimensions presets
  const sizeMap = {
    sm: { w: 100, h: 56 },
    md: { w: 140, h: 78 },
    lg: { w: 180, h: 100 },
    xl: { w: 220, h: 124 },
    custom: { w: width || 140, h: height || 78 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const w = width || currentSize.w;
  const h = height || currentSize.h;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        badgeStyle ? 'filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]' : ''
      } ${className}`}
      style={{ width: w, height: h }}
      aria-label="Logo Oficial NEM LANCHES"
    >
      <svg
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <defs>
          {/* Subtle gradient for burger top bun */}
          <linearGradient id="bunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5B942" />
            <stop offset="100%" stopColor="#E09C24" />
          </linearGradient>

          {/* Gradient for red NEM text matching official brand red */}
          <linearGradient id="nemRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EB4239" />
            <stop offset="100%" stopColor="#D92F26" />
          </linearGradient>

          {/* Subtle drop shadow for badge internal layers */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* 1. Outer White Die-Cut Sticker Contour */}
        {/* Contorno orgânico branco tipo adesivo cortado envolvendo hambúrguer + textos */}
        <path
          d="M 64 26 
             C 40 26, 20 44, 20 68 
             C 16 80, 16 100, 22 112 
             C 26 122, 38 132, 54 132 
             C 70 132, 88 126, 100 114 
             C 106 120, 114 132, 126 142 
             C 134 150, 148 158, 170 160 
             C 192 162, 238 162, 264 156 
             C 284 152, 296 138, 296 118 
             C 298 94, 298 52, 294 38 
             C 290 22, 276 16, 252 16 
             C 224 16, 190 16, 164 16 
             C 142 16, 128 20, 118 28 
             C 104 22, 86 26, 64 26 Z"
          fill="#FFFFFF"
          stroke="#F2F2F2"
          strokeWidth="3"
        />

        {/* ============================================================ */}
        {/* 2. HAMBURGER ILLUSTRATION (Left) */}
        {/* ============================================================ */}
        <g id="burger-illustration" transform="translate(18, 12)">
          {/* Top Bun */}
          <path
            d="M 28 54 C 28 32, 46 22, 68 22 C 90 22, 108 32, 108 54 Z"
            fill="url(#bunGrad)"
            stroke="#3B1C14"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Sesame seeds */}
          <ellipse cx="50" cy="34" rx="2.5" ry="1.5" fill="#FFF2CE" transform="rotate(-15 50 34)" />
          <ellipse cx="68" cy="30" rx="2.5" ry="1.5" fill="#FFF2CE" />
          <ellipse cx="86" cy="35" rx="2.5" ry="1.5" fill="#FFF2CE" transform="rotate(20 86 35)" />
          <ellipse cx="60" cy="42" rx="2.2" ry="1.3" fill="#FFF2CE" transform="rotate(10 60 42)" />
          <ellipse cx="78" cy="42" rx="2.2" ry="1.3" fill="#FFF2CE" transform="rotate(-10 78 42)" />

          {/* Melted Cheese (Golden Yellow) */}
          <path
            d="M 26 53 L 110 53 L 102 62 L 80 58 L 68 67 L 54 58 L 36 63 Z"
            fill="#F6B828"
            stroke="#3B1C14"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Wavy Green Lettuce Leaf */}
          <path
            d="M 24 62 C 28 67, 34 67, 38 63 C 42 68, 50 69, 56 63 C 62 69, 72 69, 78 63 C 84 69, 94 68, 100 63 C 106 67, 111 65, 112 62"
            fill="#7EA82B"
            stroke="#3B1C14"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Juicy Red Tomato Slices */}
          <rect
            x="30"
            y="69"
            width="76"
            height="11"
            rx="5.5"
            fill="#DE3831"
            stroke="#3B1C14"
            strokeWidth="3"
          />

          {/* Grilled Beef Patty */}
          <rect
            x="26"
            y="81"
            width="84"
            height="14"
            rx="7"
            fill="#692E1C"
            stroke="#3B1C14"
            strokeWidth="3.2"
          />

          {/* Bottom Bun */}
          <path
            d="M 30 96 L 106 96 C 106 107, 92 114, 68 114 C 44 114, 30 107, 30 96 Z"
            fill="url(#bunGrad)"
            stroke="#3B1C14"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </g>

        {/* ============================================================ */}
        {/* 3. TYPOGRAPHY: "NEM" (Tall, bold, condensed scarlet red) */}
        {/* ============================================================ */}
        <g id="typography-nem" fill="url(#nemRed)">
          {/* LETTER N */}
          <path
            d="M 136 32 
               L 152 32 
               L 174 88 
               L 174 32 
               L 189 32 
               L 189 108 
               L 173 108 
               L 151 52 
               L 151 108 
               L 136 108 Z"
          />

          {/* LETTER E */}
          <path
            d="M 197 32 
               L 235 32 
               L 235 48 
               L 213 48 
               L 213 62 
               L 231 62 
               L 231 77 
               L 213 77 
               L 213 92 
               L 236 92 
               L 236 108 
               L 197 108 Z"
          />

          {/* LETTER M */}
          <path
            d="M 244 32 
               L 261 32 
               L 269 76 
               L 278 32 
               L 294 32 
               L 294 108 
               L 280 108 
               L 280 58 
               L 273 94 
               L 265 94 
               L 258 58 
               L 258 108 
               L 244 108 Z"
          />
        </g>

        {/* ============================================================ */}
        {/* 4. TYPOGRAPHY: "LANCHES" (Bold uppercase dark espresso brown) */}
        {/* ============================================================ */}
        <g id="typography-lanches" fill="#2E1318">
          <text
            x="215"
            y="144"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="3"
          >
            LANCHES
          </text>
        </g>
      </svg>
    </div>
  );
};
