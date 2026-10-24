import React, { useState } from 'react';
import { X, Trash2, Calendar, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import { OracleReadingResponse } from './OracleReadingCard';
import { RuneItem } from '../data/cleromancyLore';
import { DieResult } from './SacredDice';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  question: string;
  category: string;
  divinationType: 'dice' | 'runes' | 'grand';
  dice: DieResult[];
  diceSum: number;
  runes: RuneItem[];
  reading: OracleReadingResponse;
}

interface GrimoireHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

export const GrimoireHistoryModal: React.FC<GrimoireHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onDeleteEntry,
  onClearAll,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (entry: HistoryEntry) => {
    const text = `🔮 Cleromancy Oracle Chronicle: ${entry.reading.title}\n` +
      `จิตอธิษฐาน: "${entry.question}"\n\n` +
      `ภาพรวม: ${entry.reading.overview}\n\n` +
      `คำแนะนำ: ${entry.reading.practicalGuidance}\n` +
      `โองการ: "${entry.reading.mysticBlessing}"`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#0F111A] border border-amber-500/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold font-cinzel text-amber-200">
                คัมภีร์บันทึกโชคชะตา (Grimoire Chronicle)
              </h2>
              <span className="text-xs text-stone-400">
                บันทึกการเสี่ยงทายทั้งหมด {history.length} รายการ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('คุณต้องการล้างประวัติการเสี่ยงทายทั้งหมดใช่หรือไม่?')) {
                    onClearAll();
                    setSelectedEntry(null);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1"
              >
                ล้างประวัติทั้งหมด
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="w-12 h-12 text-stone-600 mb-3" />
              <p className="text-base text-stone-300 font-medium">
                ยังไม่มีบันทึกคำทำนายในคัมภีร์
              </p>
              <p className="text-xs text-stone-500 max-w-xs mt-1">
                เมื่อท่านประกอบพิธีเสี่ยงทายและกดปุ่ม &ldquo;บันทึกคำทำนาย&rdquo; ผลลัพธ์จะถูกรวบรวมไว้ที่นี่
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Entries List */}
              <div className="md:col-span-5 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                {history.map((entry) => {
                  const isSelected = selectedEntry?.id === entry.id;
                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                          : 'bg-stone-900/60 border-stone-800 hover:border-amber-500/30 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500/80" />
                          <span>{formatDate(entry.timestamp)}</span>
                        </span>
                        <span className="text-amber-400 font-medium">{entry.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-200 line-clamp-1 mb-1">
                        {entry.reading.title || entry.question}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-1 italic">
                        &ldquo;{entry.question}&rdquo;
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Entry Detail View */}
              <div className="md:col-span-7 bg-black/40 border border-stone-800 rounded-2xl p-5 overflow-y-auto max-h-[60vh]">
                {selectedEntry ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                      <div>
                        <span className="text-xs text-amber-400 font-medium">
                          {selectedEntry.category} · {formatDate(selectedEntry.timestamp)}
                        </span>
                        <h3 className="text-lg font-bold font-cinzel text-amber-100 mt-0.5">
                          {selectedEntry.reading.title}
                        </h3>
                        <p className="text-xs text-stone-300 italic mt-0.5">
                          &ldquo;{selectedEntry.question}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopy(selectedEntry)}
                          className="p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-lg transition-colors"
                          title="คัดลอก"
                        >
                          {copiedId === selectedEntry.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onDeleteEntry(selectedEntry.id);
                            setSelectedEntry(null);
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-400 bg-stone-800 rounded-lg transition-colors"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Symbols Used */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedEntry.dice && selectedEntry.dice.length > 0 && (
                        <div className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300">
                          แต้มลูกเต๋า: <strong className="text-amber-400">{selectedEntry.diceSum}</strong> ({selectedEntry.dice.map(d => `${d.glyph}${d.score}`).join(' + ')})
                        </div>
                      )}
                      {selectedEntry.runes && selectedEntry.runes.length > 0 && (
                        <div className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 flex items-center gap-1">
                          รูนศักดิ์สิทธิ์: {selectedEntry.runes.map(r => (
                            <span key={r.id} className="text-amber-300 font-cinzel font-bold">{r.symbol} {r.name}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h5 className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold mb-1">
                        ภาพรวมคำทำนาย
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                        {selectedEntry.reading.overview}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30">
                      <h5 className="text-xs font-semibold text-amber-300 mb-1">
                        แนวทางปฏิบัติจริง
                      </h5>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {selectedEntry.reading.practicalGuidance}
                      </p>
                    </div>

                    <div className="text-xs italic text-amber-200 font-cinzel">
                      &ldquo;{selectedEntry.reading.mysticBlessing}&rdquo;
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center text-stone-500">
                    <ChevronRight className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">เลือกรายการทางซ้ายเพื่อเปิดอ่านคำพยากรณ์</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
