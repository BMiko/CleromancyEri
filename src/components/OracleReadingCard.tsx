import React, { useState } from 'react';
import { Sparkles, Bookmark, Check, Copy, Compass, ShieldCheck, Flame } from 'lucide-react';
import { RuneItem, AstragalomancyScoreLore } from '../data/cleromancyLore';
import { DieResult } from './SacredDice';

export interface OracleReadingResponse {
  title: string;
  overview: string;
  deepAnalysis: string;
  pivotalMoment: string;
  practicalGuidance: string;
  mysticBlessing: string;
  elementalAffinity: string;
  auspiciousColors: string[];
}

interface OracleReadingCardProps {
  question: string;
  category: string;
  divinationType: 'dice' | 'runes' | 'grand';
  dice: DieResult[];
  diceSum: number;
  diceLore?: AstragalomancyScoreLore;
  runes: RuneItem[];
  reading: OracleReadingResponse | null;
  isLoading: boolean;
  onSaveToGrimoire: () => void;
  isSaved: boolean;
  onNewInquiry: () => void;
}

export const OracleReadingCard: React.FC<OracleReadingCardProps> = ({
  question,
  category,
  divinationType,
  dice,
  diceSum,
  diceLore,
  runes,
  reading,
  isLoading,
  onSaveToGrimoire,
  isSaved,
  onNewInquiry,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!reading) return;
    const text = `🔮 Cleromancy Oracle: ${reading.title}\n` +
      `จิตอธิษฐาน: "${question}" (${category})\n\n` +
      `【ภาพรวมคำพยากรณ์】\n${reading.overview}\n\n` +
      `【วิเคราะห์เจาะลึก】\n${reading.deepAnalysis}\n\n` +
      `【จุดเปลี่ยนสำคัญ & สิ่งเตือนสติ】\n${reading.pivotalMoment}\n\n` +
      `【แนวทางปฏิบัติจริง】\n${reading.practicalGuidance}\n\n` +
      `【โองการมงคล】\n"${reading.mysticBlessing}"\n` +
      `ธาตุหนุนนำ: ${reading.elementalAffinity} · สีมงคล: ${reading.auspiciousColors.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-[#121520]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-md">
      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-400/40 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-400/40 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-400/40 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-400/40 rounded-br-3xl pointer-events-none" />

      {/* Top Header & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>คำพยากรณ์จากแท่นบูชาศักดิ์สิทธิ์</span>
            <span aria-hidden="true">·</span>
            <span>{category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100 tracking-wide mt-1">
            {reading?.title || 'กำลังหยั่งรู้กระแสชะตา...'}
          </h2>
          <p className="text-sm text-stone-300 italic mt-1">
            &ldquo;{question}&rdquo;
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleCopy}
            disabled={!reading || isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 rounded-xl transition-colors disabled:opacity-50"
            title="คัดลอกคำทำนาย"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>

          <button
            onClick={onSaveToGrimoire}
            disabled={!reading || isLoading || isSaved}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-800/80 text-stone-300 hover:text-white border-stone-700/60 hover:bg-stone-700/80'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'บันทึกในคัมภีร์แล้ว' : 'บันทึกคำทำนาย'}</span>
          </button>
        </div>
      </div>

      {/* Classical Results Strip (Instant Lore) */}
      <div className="py-6 border-b border-stone-800/80">
        <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>สัญลักษณ์ที่ปรากฏจากการสุ่ม (Sacred Glyphs Revealed)</span>
        </h3>

        {/* Astragalomancy Dice Results */}
        {(divinationType === 'dice' || divinationType === 'grand') && dice.length > 0 && (
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 mb-3">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-sm font-semibold text-amber-200">
                Astragalomancy: แต้มรวม {diceSum}
              </span>
              {diceLore && (
                <span className="text-xs text-amber-400 font-medium bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-700/30">
                  {diceLore.nature}
                </span>
              )}
            </div>
            {diceLore && (
              <p className="text-xs sm:text-sm text-stone-300 mb-2">
                <strong className="text-amber-100">{diceLore.title}:</strong> {diceLore.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {dice.map((d) => (
                <span
                  key={d.index}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300"
                >
                  <span className="text-amber-400 font-bold">{d.glyph}</span>
                  <span>{d.name}:</span>
                  <span className="font-mono text-amber-300 font-bold">{d.score}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sacred Runes Results */}
        {(divinationType === 'runes' || divinationType === 'grand') && runes.length > 0 && (
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
            <span className="text-sm font-semibold text-amber-200 block mb-2">
              Elder Futhark: หินรูนสลัก 3 ภพ
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {runes.map((rune, idx) => {
                const labels = ['รากฐาน/อดีต', 'ปัจจุบัน/บททดสอบ', 'อนาคต/ทางออก'];
                return (
                  <div key={rune.id} className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-cinzel font-bold text-amber-300">
                        {rune.symbol}
                      </span>
                      <div>
                        <span className="text-[11px] text-amber-400/80 block">
                          {labels[idx]}
                        </span>
                        <span className="text-xs font-semibold text-stone-200">
                          {rune.name} ({rune.phonetic})
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-300 line-clamp-2">
                      {rune.meaning}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Deep Analysis Section */}
      <div className="pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-14 space-y-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Flame className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-semibold text-amber-200 font-cinzel">
                กำลังเปิดเนตรพยากรณ์และเชื่อมโยงมิติชะตา...
              </p>
              <p className="text-xs text-stone-400 mt-1">
                ผสานคลื่นพลังจากคำถาม แต้มลูกเต๋า และอักขระรูนเข้าด้วยกัน
              </p>
            </div>
          </div>
        ) : reading ? (
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                ภาพรวมกระแสชะตา (Destiny Stream)
              </h4>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                {reading.overview}
              </p>
            </div>

            {/* Deep Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30">
                <h5 className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>การวิเคราะห์เจาะลึกเฉพาะดวงชะตา</span>
                </h5>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {reading.deepAnalysis}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/15 border border-red-500/20">
                <h5 className="text-xs font-semibold text-red-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>จุดเปลี่ยน & สิ่งเตือนสติ (Crucial Caution)</span>
                </h5>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {reading.pivotalMoment}
                </p>
              </div>
            </div>

            {/* Practical Guidance */}
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                แนวทางปฏิบัติและหลักคิดนำทาง (Practical Wisdom)
              </h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                {reading.practicalGuidance}
              </p>
            </div>

            {/* Mystic Blessing & Elements */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/40 border border-amber-500/30 gap-4">
              <div>
                <span className="text-[11px] text-amber-400/90 font-medium block">
                  โองการอวยพรศักดิ์สิทธิ์
                </span>
                <p className="text-sm font-cinzel italic text-amber-200 mt-0.5">
                  &ldquo;{reading.mysticBlessing}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-stone-300">
                <div>
                  <span className="text-stone-500 block text-[10px]">ธาตุหนุนนำ</span>
                  <span className="font-semibold text-amber-300">{reading.elementalAffinity}</span>
                </div>
                <div className="w-px h-6 bg-stone-800" />
                <div>
                  <span className="text-stone-500 block text-[10px]">สีมงคลเสริมโชค</span>
                  <span className="font-semibold text-amber-200">{reading.auspiciousColors.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Footer Button */}
      <div className="mt-8 pt-6 border-t border-stone-800 flex justify-center">
        <button
          onClick={onNewInquiry}
          className="px-6 py-2.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95"
        >
          ตั้งจิตเสี่ยงทายคำถามใหม่
        </button>
      </div>
    </div>
  );
};
