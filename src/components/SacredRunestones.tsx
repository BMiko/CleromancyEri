import React from 'react';
import { RuneItem } from '../data/cleromancyLore';

interface SacredRunestonesProps {
  runes: RuneItem[];
  isCasting: boolean;
  onRuneClick?: (rune: RuneItem, position: string) => void;
}

export const SacredRunestones: React.FC<SacredRunestonesProps> = ({
  runes,
  isCasting,
  onRuneClick,
}) => {
  const positions = [
    { title: 'รากฐาน & อดีต', subtitle: 'ปฐมบทของปัญหา/พลังดั้งเดิม' },
    { title: 'ปัจจุบัน & บททดสอบ', subtitle: 'สถานการณ์จริง/สิ่งที่ต้องเผชิญ' },
    { title: 'อนาคต & ทางออก', subtitle: 'ผลลัพธ์ที่จะคลี่คลาย/คำแนะนำ' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4">
      {runes.map((rune, index) => {
        const pos = positions[index] || { title: `ตำแหน่ง ${index + 1}`, subtitle: '' };

        return (
          <div
            key={rune.id || index}
            onClick={() => onRuneClick && onRuneClick(rune, pos.title)}
            className="flex flex-col items-center group cursor-pointer max-w-[140px]"
          >
            {/* Obsidian Stone Pebble */}
            <div
              className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-[2.5rem] bg-gradient-to-b from-stone-900 via-[#10121a] to-black border border-stone-800 shadow-[0_12px_28px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out flex items-center justify-center select-none ${
                isCasting
                  ? 'animate-[bounce_0.4s_infinite] scale-90 rotate-6 shadow-[0_0_25px_rgba(212,175,55,0.7)]'
                  : 'group-hover:scale-105 group-hover:-translate-y-1 group-hover:border-amber-500/50'
              }`}
            >
              {/* Natural Stone Specular Sheen */}
              <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-gradient-to-r from-stone-400/25 to-transparent blur-[1px] pointer-events-none transform -rotate-12" />

              {/* Glowing Gold Engraved Rune Glyph */}
              <div className="flex flex-col items-center justify-center z-10">
                <span
                  className={`text-4xl sm:text-5xl font-cinzel font-black tracking-widest text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] transition-all duration-700 ${
                    isCasting ? 'opacity-30 blur-sm' : 'opacity-100'
                  }`}
                  style={{
                    textShadow:
                      '0 0 10px rgba(245, 158, 11, 0.8), 0 0 20px rgba(212, 175, 55, 0.5)',
                  }}
                >
                  {rune.symbol}
                </span>
                <span className="text-[10px] text-amber-200/90 font-cinzel tracking-wider mt-1 font-semibold">
                  {rune.name}
                </span>
              </div>

              {/* Deep stone crack/texture effect */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-amber-500/10 pointer-events-none" />
            </div>

            {/* Position Labels */}
            <div className="mt-3 text-center">
              <span className="block text-xs font-semibold text-amber-300/90 font-cinzel">
                {pos.title}
              </span>
              <span className="block text-[11px] text-stone-400 line-clamp-1">
                {rune.meaning}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
