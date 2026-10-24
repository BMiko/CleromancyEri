import React, { useState } from 'react';
import { X, Book, Sparkles, Compass, Shield } from 'lucide-react';
import { SACRED_RUNES, ASTRAGALOMANCY_SUM_LORE } from '../data/cleromancyLore';

interface CleromancyCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CleromancyCompendiumModal: React.FC<CleromancyCompendiumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'runes' | 'dice'>('intro');
  const [searchRune, setSearchRune] = useState('');

  if (!isOpen) return null;

  const filteredRunes = SACRED_RUNES.filter(
    (r) =>
      r.name.toLowerCase().includes(searchRune.toLowerCase()) ||
      r.thaiName.toLowerCase().includes(searchRune.toLowerCase()) ||
      r.meaning.toLowerCase().includes(searchRune.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#0F111A] border border-amber-500/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Book className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold font-cinzel text-amber-200">
                สารานุกรมตำราพยากรณ์ Cleromancy (Sacred Lore)
              </h2>
              <span className="text-xs text-stone-400">
                ความรู้ ศาสตร์โบราณว่าด้วยการเสี่ยงทายศิลาและลูกเต๋า
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 px-6 gap-2 bg-black/20">
          <button
            onClick={() => setActiveTab('intro')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'intro'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ปรัชญา Cleromancy</span>
          </button>
          <button
            onClick={() => setActiveTab('dice')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'dice'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>ลูกเต๋า Astragalomancy</span>
          </button>
          <button
            onClick={() => setActiveTab('runes')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'runes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>24 อักษรรูนศักดิ์สิทธิ์</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-stone-300">
          {activeTab === 'intro' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold font-cinzel text-amber-200 mb-2">
                  ความหมายและประวัติศาสตร์ของ Cleromancy
                </h3>
                <p className="leading-relaxed text-stone-300">
                  <strong>Cleromancy (เคลโรมังซี)</strong> มาจากภาษากรีกโบราณ <em>&ldquo;kleros&rdquo;</em> (ก้อนหิน, ไม้เสี่ยงทาย, หรือส่วนแบ่งแห่งโชคชะตา) รวมกับ <em>&ldquo;manteia&rdquo;</em> (การพยากรณ์) เป็นหนึ่งในศาสตร์ดูดวงที่เก่าแก่ที่สุดในประวัติศาสตร์มนุษยชาติ มีบันทึกมานานกว่า 3,000 ปีตั้งแต่ยุคเมโสโปเตเมีย อียิปต์โบราณ กรีก-โรมัน จนถึงชนเผ่านอร์สโบราณแห่งยุโรปเหนือ
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                <h4 className="text-sm font-semibold text-amber-300 mb-1">
                  หัวใจแห่งการเสี่ยงทาย: &ldquo;ไม่มีความบังเอิญในจักรวาล&rdquo;
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  ศาสตร์ Cleromancy เชื่อว่า การโยนลูกเต๋าหรือการเหวี่ยงก้อนหินลงบนแท่นบูชาไม่ได้เป็นเพียงความสุ่มแบบไร้จุดหมาย แต่เป็นจังหวะที่คลื่นจิตใต้สำนึก สมาธิ และพลังงานรอบตัวของผู้ถาม ประสานเข้ากับกลไกทางฟิสิกส์ เพื่อดึงดูดสัญลักษณ์ที่สอดคล้องกับสัจธรรมของชีวิตในขณะนั้น (Synchronicity)
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-amber-200 mb-2">
                  อุปกรณ์การพยากรณ์หลักในแอปพลิเคชันนี้
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-bold text-amber-300 font-cinzel block mb-1">
                      1. Astragalomancy (ลูกเต๋า 3 กษัตริย์)
                    </span>
                    <p className="text-xs text-stone-400">
                      สืบทอดจากกระดูกข้อเท้าสัตว์และลูกเต๋าทองเหลืองโบราณ 3 ลูก แบ่งตามสภาวะ: ลูกเต๋าสุริยะ (เจตจำนง), ลูกเต๋าจันทรา (อารมณ์), และลูกเต๋าธรณี (ทรัพย์สินจริง)
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="font-bold text-amber-300 font-cinzel block mb-1">
                      2. Elder Futhark Runes (หินรูน 3 ภพ)
                    </span>
                    <p className="text-xs text-stone-400">
                      อักขระเวทมนตร์ 24 ตัวแห่งเทพโอดิน สลักลงบนหินออบซิเดียนสีดำขลับ เพื่อเปิดเผยรากฐานปัญหา สภาวะปัจจุบัน และแนวทางผลลัพธ์ในอนาคต
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-cinzel text-amber-200 mb-1">
                  ศาสตร์ Astragalomancy (การพยากรณ์ด้วยผลรวมลูกเต๋า 3-18)
                </h3>
                <p className="text-xs text-stone-400 mb-4">
                  เมื่อทอยลูกเต๋าโบราณทั้งสามลูก ผลรวมของแต้มจะบ่งชี้ถึงกระแสชะตาตามบันทึกคำพยากรณ์คลาสสิก:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(ASTRAGALOMANCY_SUM_LORE).map((lore) => (
                  <div
                    key={lore.sum}
                    className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-cinzel text-lg font-black text-amber-400">
                        แต้ม {lore.sum}
                      </span>
                      <span className="text-[10px] text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        {lore.nature.split(' ')[0]}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-stone-200 mb-1">
                      {lore.title}
                    </h5>
                    <p className="text-xs text-stone-400 leading-snug">
                      {lore.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'runes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-cinzel text-amber-200">
                    24 อักษรรูนศักดิ์สิทธิ์ (Elder Futhark Runes)
                  </h3>
                  <span className="text-xs text-stone-400">
                    ค้นหาความหมาย สัญลักษณ์ และพลังธาตุของแต่ละรูน
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="ค้นหารูน เช่น Fehu, แสงสว่าง, การเงิน..."
                  value={searchRune}
                  onChange={(e) => setSearchRune(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:border-amber-400 w-full sm:w-64"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {filteredRunes.map((rune) => (
                  <div
                    key={rune.id}
                    className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-cinzel font-black text-amber-400 drop-shadow">
                        {rune.symbol}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-amber-100 font-cinzel">
                          {rune.name} ({rune.phonetic})
                        </h4>
                        <span className="text-[10px] text-amber-400/90 font-medium">
                          ธาตุ: {rune.element}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-300 mb-2 leading-relaxed">
                      {rune.meaning}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rune.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-stone-400 border border-stone-800"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
