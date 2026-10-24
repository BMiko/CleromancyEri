import React from 'react';

interface CandleProps {
  height?: string;
  delay?: string;
  waxColor?: string;
}

export const Candle: React.FC<CandleProps> = ({
  height = 'h-16',
  delay = '0s',
  waxColor = 'bg-stone-300',
}) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Flame & Glow */}
      <div
        className="relative mb-0.5 animate-candle"
        style={{ animationDelay: delay }}
      >
        {/* Outer radial glow */}
        <div className="absolute -inset-2.5 rounded-full bg-amber-500/20 blur-md pointer-events-none" />
        {/* Core flame shape */}
        <div className="relative w-2.5 h-5 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        {/* Blue base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-full bg-blue-500/80 blur-[0.5px]" />
      </div>

      {/* Wick */}
      <div className="w-0.5 h-1.5 bg-stone-800" />

      {/* Wax Pillar */}
      <div
        className={`w-4 ${height} ${waxColor} rounded-t-sm shadow-md border-t border-stone-200/40 relative overflow-hidden`}
      >
        {/* Wax melt gradient & shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-amber-100/50 rounded-full blur-[0.5px]" />
      </div>

      {/* Brass candlestick base */}
      <div className="w-7 h-2 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-900 rounded-b-md shadow-sm border-t border-amber-300/40" />
    </div>
  );
};
