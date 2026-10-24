import React from 'react';

export interface DieResult {
  index: number;
  name: string;
  domain: string;
  score: number;
  glyph: string;
}

interface SacredDiceProps {
  dice: DieResult[];
  isRolling: boolean;
  onDiceClick?: (index: number) => void;
}

export const SacredDice: React.FC<SacredDiceProps> = ({
  dice,
  isRolling,
  onDiceClick,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4">
      {dice.map((die) => {
        const isSol = die.index === 0;
        const isLuna = die.index === 1;

        // Custom aesthetic gradient per die type
        const bgGrad = isSol
          ? 'from-amber-600 via-yellow-500 to-amber-700 text-stone-950 border-amber-300/80 shadow-[0_0_24px_rgba(245,158,11,0.4)]'
          : isLuna
          ? 'from-slate-700 via-indigo-400 to-indigo-900 text-indigo-950 border-indigo-200/80 shadow-[0_0_24px_rgba(129,140,248,0.4)]'
          : 'from-emerald-700 via-amber-600 to-emerald-950 text-amber-950 border-emerald-300/80 shadow-[0_0_24px_rgba(16,185,129,0.35)]';

        return (
          <div
            key={die.index}
            onClick={() => onDiceClick && onDiceClick(die.index)}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* 3D Dice Object */}
            <div
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${bgGrad} p-1.5 border-2 transition-transform duration-500 ease-out flex items-center justify-center select-none ${
                isRolling
                  ? 'animate-[spin_0.35s_linear_infinite] scale-95 shadow-[0_0_35px_rgba(212,175,55,0.8)]'
                  : 'group-hover:scale-105 group-hover:-translate-y-1'
              }`}
              style={{
                perspective: '600px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Inner metallic chamber */}
              <div className="w-full h-full rounded-xl bg-black/15 backdrop-blur-[1px] flex flex-col items-center justify-between p-2 border border-white/20">
                {/* Top Corner Astrological Glyph */}
                <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-semibold opacity-80">
                  <span>{die.glyph}</span>
                  <span className="font-mono tabular-nums text-xs">#{die.index + 1}</span>
                </div>

                {/* Central Roman / Numeric Pips */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <span className="font-cinzel text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
                    {die.score}
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-medium opacity-75">
                    {die.score === 1
                      ? 'I'
                      : die.score === 2
                      ? 'II'
                      : die.score === 3
                      ? 'III'
                      : die.score === 4
                      ? 'IV'
                      : die.score === 5
                      ? 'V'
                      : 'VI'}
                  </span>
                </div>

                {/* Bottom pip indicators */}
                <div className="flex gap-1 items-center justify-center">
                  {Array.from({ length: die.score }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-current opacity-80"
                    />
                  ))}
                </div>
              </div>

              {/* Corner specular highlights */}
              <div className="absolute top-1 left-2 w-4 h-1.5 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
            </div>

            {/* Die Label & Domain */}
            <div className="mt-3 text-center">
              <span className="block text-xs font-semibold text-amber-200/90 font-cinzel">
                {die.name}
              </span>
              <span className="block text-[11px] text-stone-400">
                {die.domain}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
