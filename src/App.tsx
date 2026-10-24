/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  RotateCcw,
  Compass,
  Shield,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { ParticleBackdrop } from './components/ParticleBackdrop';
import { Candle } from './components/CandleAltar';
import { SacredDice, DieResult } from './components/SacredDice';
import { SacredRunestones } from './components/SacredRunestones';
import { OracleReadingCard, OracleReadingResponse } from './components/OracleReadingCard';
import { GrimoireHistoryModal, HistoryEntry } from './components/GrimoireHistoryModal';
import { CleromancyCompendiumModal } from './components/CleromancyCompendiumModal';
import {
  SACRED_RUNES,
  ASTRAGALOMANCY_SUM_LORE,
  DICE_ASPECTS,
  PRESET_INTENTIONS,
  RuneItem,
} from './data/cleromancyLore';
import { mysticAudio } from './utils/audioFx';

const STORAGE_KEY = 'cleromancy_grimoire_history_v1';

export default function App() {
  // Navigation & Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Divination Options
  const [divinationType, setDivinationType] = useState<'dice' | 'runes' | 'grand'>('grand');
  const [selectedCategory, setSelectedCategory] = useState<string>('ความรัก & ความสัมพันธ์');
  const [question, setQuestion] = useState<string>('');

  // Ritual Cast State
  const [isCasting, setIsCasting] = useState(false);
  const [hasCast, setHasCast] = useState(false);
  const [dice, setDice] = useState<DieResult[]>([
    { index: 0, name: 'ลูกเต๋าสุริยะ', domain: 'เจตจำนง · การงาน', score: 6, glyph: '☉' },
    { index: 1, name: 'ลูกเต๋าจันทรา', domain: 'อารมณ์ · ความรัก', score: 5, glyph: '☽' },
    { index: 2, name: 'ลูกเต๋าธรณี', domain: 'ทรัพย์สิน · ความจริง', score: 6, glyph: '⊕' },
  ]);
  const [runes, setRunes] = useState<RuneItem[]>([
    SACRED_RUNES[0], // Fehu
    SACRED_RUNES[14], // Algiz
    SACRED_RUNES[15], // Sowilo
  ]);

  // AI & Results State
  const [reading, setReading] = useState<OracleReadingResponse | null>(null);
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isSavedInGrimoire, setIsSavedInGrimoire] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  // Sync mute state
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    mysticAudio.setMuted(next);
  };

  // Roll / Cast Handler
  const handleCastRitual = async () => {
    if (isCasting) return;
    setIsCasting(true);
    setHasCast(true);
    setIsSavedInGrimoire(false);
    setReading(null);

    // Audio effects sequence
    if (divinationType === 'dice') {
      mysticAudio.playDiceRoll();
    } else if (divinationType === 'runes') {
      mysticAudio.playStoneDrop();
    } else {
      mysticAudio.playDiceRoll();
      setTimeout(() => mysticAudio.playStoneDrop(), 280);
    }

    // Dynamic random generation
    // 1. Generate 3 dice scores (1-6) and glyphs
    const newDice: DieResult[] = DICE_ASPECTS.map((aspect) => {
      const score = Math.floor(Math.random() * 6) + 1;
      const glyph = aspect.glyphs[score - 1] || '✦';
      return {
        index: aspect.index,
        name: aspect.title,
        domain: aspect.domain,
        score,
        glyph,
      };
    });

    // 2. Select 3 distinct random runes from 24
    const shuffledRunes = [...SACRED_RUNES].sort(() => Math.random() - 0.5);
    const newRunes = shuffledRunes.slice(0, 3);

    // Wait for tumble animation
    await new Promise((resolve) => setTimeout(resolve, 900));

    setDice(newDice);
    setRunes(newRunes);
    setIsCasting(false);
    mysticAudio.playSacredChime();

    // Call Gemini API for deep reading
    const currentDiceSum = newDice.reduce((acc, d) => acc + d.score, 0);
    const currentIntention = question.trim() || 'คำชี้แนะแนวทางชะตาชีวิตโดยรวม';

    setIsLoadingReading(true);
    try {
      const response = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentIntention,
          category: selectedCategory,
          divinationType,
          diceResults: divinationType !== 'runes' ? newDice : [],
          diceSum: currentDiceSum,
          runeResults: divinationType !== 'dice' ? newRunes : [],
        }),
      });

      const data = await response.json();
      if (data.success && data.reading) {
        setReading(data.reading);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      console.warn('API divine failed or offline, applying ancient lore fallback:', err);
      // Graceful offline fallback
      const diceLore = ASTRAGALOMANCY_SUM_LORE[currentDiceSum] || ASTRAGALOMANCY_SUM_LORE[10];
      setReading({
        title: `${diceLore.title} · มนตราศิลา ${newRunes[0]?.name}`,
        overview: `จากผลการเสี่ยงทายที่ปรากฏต่อคำถาม "${currentIntention}": แต้มรวมแห่งลูกเต๋าพยากรณ์คือ ${currentDiceSum} (${diceLore.nature}) สอดประสานกับพลังของอักษรรูน ${newRunes[0]?.name} ในตำแหน่งรากฐาน และ ${newRunes[2]?.name} ในตำแหน่งทางออก โชคชะตาชี้ว่าปัญหาหรือสิ่งที่คุณกำลังครุ่นคิดกำลังเข้าสู่วัฏจักรแห่งการคลี่คลายตามเวลา`,
        deepAnalysis: `รูน ${newRunes[0]?.thaiName} ชี้ว่าจุดเริ่มต้นเกิดจากพลังความตั้งใจเดิม ส่วน ${newRunes[1]?.thaiName} สะท้อนถึงบททดสอบปัจจุบันที่ต้องการความสุขุมรอบคอบ ผลลัพธ์สุดท้ายภายใต้อิทธิพลของ ${newRunes[2]?.thaiName} ยืนยันว่าหากคุณไม่ละทิ้งความเพียรพยายาม สิ่งดีๆ กำลังรออยู่`,
        pivotalMoment: `ระวังความใจร้อนหรือการด่วนตัดสินใจในช่วงเวลาที่อารมณ์ยังไม่สงบนิ่ง ให้พิจารณาข้อเท็จจริงมากกว่าคำพูดลอยๆ ของคนรอบข้าง`,
        practicalGuidance: `${diceLore.ancientGuidance} หมั่นทำจิตใจให้ผ่องใส จัดระเบียบความคิดและพื้นที่ทำงาน จะช่วยดึงดูดพลังมงคลเข้ามา`,
        mysticBlessing: `ขอให้แสงสว่างแห่งปัญญาและเกราะคุ้มครองสถิตอยู่กับท่านในทุกย่างก้าว`,
        elementalAffinity: newRunes[0]?.element || 'ธาตุทองคำศักดิ์สิทธิ์',
        auspiciousColors: ['สีทองอำพัน', 'สีดำออบซิเดียน', 'สีน้ำเงินคราม'],
      });
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Save to History
  const handleSaveToGrimoire = () => {
    if (!reading) return;
    const currentDiceSum = dice.reduce((acc, d) => acc + d.score, 0);
    const newEntry: HistoryEntry = {
      id: `cast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      question: question.trim() || 'คำชี้แนะแนวทางชะตาชีวิตโดยรวม',
      category: selectedCategory,
      divinationType,
      dice: divinationType !== 'runes' ? dice : [],
      diceSum: currentDiceSum,
      runes: divinationType !== 'dice' ? runes : [],
      reading,
    };

    const updated = [newEntry, ...history];
    setHistory(updated);
    setIsSavedInGrimoire(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
    mysticAudio.playWhisper();
  };

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // safe fallback
    }
  };

  // Delete Single History Entry
  const handleDeleteHistoryEntry = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  // Reset for New Inquiry
  const handleNewInquiry = () => {
    setQuestion('');
    setHasCast(false);
    setReading(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentDiceSum = dice.reduce((acc, d) => acc + d.score, 0);
  const currentDiceLore = ASTRAGALOMANCY_SUM_LORE[currentDiceSum] || ASTRAGALOMANCY_SUM_LORE[10];

  return (
    <div className="relative min-h-screen bg-[#07080D] text-[#E2E8F0] overflow-x-hidden selection:bg-amber-500/30">
      {/* Background Ambience & Generated Art Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[0.5px] pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url('/src/assets/images/cavern_altar_backdrop_1792831904024.jpg')`,
        }}
      />
      {/* Radial vignette scrim for focal presence */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_rgba(7,8,13,0.92)_65%,_#07080D_100%)] pointer-events-none" />

      {/* Dynamic Golden Embers Canvas */}
      <ParticleBackdrop />

      {/* Top Bar Contract (One-row, 3-zone contract) */}
      <header className="relative z-30 flex items-center justify-between gap-8 px-6 sm:px-12 py-4 border-b border-stone-800/80 bg-black/40 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg sm:text-xl font-bold font-cinzel tracking-wider text-amber-200 whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-amber-100 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Cleromancy: Sacred Cavern</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => {
              setHasCast(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            แท่นบูชาพยากรณ์
          </button>
          <button
            onClick={() => setIsCompendiumOpen(true)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-left flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>ตำราศาสตร์โบราณ</span>
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-left flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>คัมภีร์ประวัติ ({history.length})</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & sound toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 border border-stone-800 transition-colors"
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
            aria-label="Toggle Mystic Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleNewInquiry}
            className="px-4 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-sm transition-transform active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>เสี่ยงทายใหม่</span>
          </button>
        </div>
      </header>

      {/* Main Sanctuary Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Altar Introduction & Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400/90 font-medium mb-2">
            <span>ศาสตร์ดูดวงการเสี่ยงทายโบราณ</span>
            <span aria-hidden="true">·</span>
            <span>Astragalomancy & Sacred Runes</span>
            <span aria-hidden="true">·</span>
            <span>หยั่งรู้ชะตาด้วยหินและลูกเต๋า</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-cinzel tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 text-balance">
            วิหารศิลาและลูกเต๋าพยากรณ์
          </h1>
          <p className="text-sm sm:text-base text-stone-400 mt-3 font-light leading-relaxed">
            ตั้งจิตอธิษฐานถามสิ่งที่ติดค้างในใจ แล้วปล่อยให้อุปกรณ์ศักดิ์สิทธิ์สื่อสารผ่านกลไกแห่งจักรวาล
          </p>
        </div>

        {/* Intention & Ritual Setup Panel */}
        <div className="max-w-3xl mx-auto mb-8 p-6 sm:p-8 rounded-3xl bg-[#0E1019]/90 border border-amber-500/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Question / Intention Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="intention-input" className="text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>คำถามหรือจิตอธิษฐาน (Intention & Question)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCompendiumOpen(true)}
                className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                <span>วิธีตั้งคำถามที่ดี</span>
              </button>
            </div>
            <textarea
              id="intention-input"
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="พิมพ์คำถามหรือเรื่องที่ท่านต้องการคำแนะนำ เช่น 'ความรักกับคนที่คุยอยู่มีทิศทางอย่างไร?' หรือ 'ควรเปลี่ยนงานช่วงนี้ดีไหม?'"
              className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 text-sm leading-relaxed transition-colors resize-none"
            />
          </div>

          {/* Quick Category Buttons */}
          <div className="mb-6">
            <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2.5">
              เลือกหัวข้อที่ตรงกับเรื่องราวของคุณ
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_INTENTIONS.map((preset) => {
                const isSelected = selectedCategory === preset.label;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(preset.label);
                      if (!question.trim()) {
                        setQuestion(preset.promptExample);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm'
                        : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divination Type Segmented Selector */}
          <div>
            <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2.5">
              เลือกอุปกรณ์ประกอบพิธี Cleromancy
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/50 border border-stone-800">
              <button
                type="button"
                onClick={() => setDivinationType('grand')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                  divinationType === 'grand'
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <span className="font-cinzel">พิธีมหาสังเคราะห์ (Grand Cast)</span>
                <span className="text-[10px] text-stone-400 font-normal">ทอยลูกเต๋า 3 ลูก + หินรูน 3 ก้อน</span>
              </button>

              <button
                type="button"
                onClick={() => setDivinationType('dice')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                  divinationType === 'dice'
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <span className="font-cinzel flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>ลูกเต๋า Astragalomancy</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">3 ลูกเต๋าทองเหลืองแห่งทวยเทพ</span>
              </button>

              <button
                type="button"
                onClick={() => setDivinationType('runes')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                  divinationType === 'runes'
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <span className="font-cinzel flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>หินรูนสลักศักดิ์สิทธิ์</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">3 หินออบซิเดียนอักขระนอร์ส</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sacred Altar Surface (The Casting Chamber) */}
        <div className="relative max-w-4xl mx-auto rounded-[3rem] p-6 sm:p-12 bg-gradient-to-b from-[#11131E] via-[#0E1019] to-[#0A0B12] border-2 border-amber-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* Inner Ritual Circle Watermark / Magic Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <div className="w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-amber-400/50 flex items-center justify-center">
              <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-amber-400/30" />
            </div>
          </div>

          {/* Candle Illuminations at Corners of the Altar */}
          <div className="absolute top-6 left-6">
            <Candle height="h-12" delay="0s" />
          </div>
          <div className="absolute top-6 right-6">
            <Candle height="h-14" delay="1.2s" />
          </div>
          <div className="absolute bottom-6 left-6 hidden sm:block">
            <Candle height="h-10" delay="0.6s" />
          </div>
          <div className="absolute bottom-6 right-6 hidden sm:block">
            <Candle height="h-16" delay="1.8s" />
          </div>

          {/* Altar Centerpiece: Cast Objects Display */}
          <div className="relative z-10 py-6 sm:py-8">
            {/* Astragalomancy Dice Display */}
            {(divinationType === 'dice' || divinationType === 'grand') && (
              <div className="mb-6">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-400/80">
                    Astragalomancy · 3 กษัตริย์พยากรณ์
                  </span>
                </div>
                <SacredDice
                  dice={dice}
                  isRolling={isCasting}
                  onDiceClick={() => {
                    mysticAudio.playDiceRoll();
                  }}
                />
              </div>
            )}

            {/* Elder Futhark Runestones Display */}
            {(divinationType === 'runes' || divinationType === 'grand') && (
              <div>
                <div className="text-center mb-2">
                  <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-400/80">
                    Sacred Runes · 3 ภพแห่งอดีต ปัจจุบัน อนาคต
                  </span>
                </div>
                <SacredRunestones
                  runes={runes}
                  isCasting={isCasting}
                  onRuneClick={(rune) => {
                    mysticAudio.playStoneDrop();
                  }}
                />
              </div>
            )}

            {/* Cast & Roll Ritual Trigger Button */}
            <div className="mt-8 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleCastRitual}
                disabled={isCasting || isLoadingReading}
                className="group relative px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold font-cinzel text-sm sm:text-base tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-3"
              >
                <Flame className={`w-5 h-5 text-stone-950 ${isCasting ? 'animate-spin' : 'animate-bounce'}`} />
                <span>
                  {isCasting
                    ? 'กำลังหมุนเสี่ยงทายและเหวี่ยงศิลา...'
                    : hasCast
                    ? 'เสี่ยงทายอีกครั้ง (Cast Again)'
                    : 'เขย่าและเหวี่ยงอุปกรณ์เสี่ยงทาย (Cast Ritual)'}
                </span>
                <Sparkles className="w-4 h-4 text-stone-950 opacity-80" />
              </button>

              <span className="text-[11px] text-stone-400 mt-2.5 flex items-center gap-1.5">
                <span>คลิกเพื่อทอยลูกเต๋าและสลักหินรูน</span>
                <span aria-hidden="true">·</span>
                <span>ระบบจะวิเคราะห์ผลลัพธ์ผ่าน AI ทันที</span>
              </span>
            </div>
          </div>
        </div>

        {/* Oracle Reading Revelation Card */}
        {hasCast && (
          <OracleReadingCard
            question={question.trim() || 'คำชี้แนะแนวทางชะตาชีวิตโดยรวม'}
            category={selectedCategory}
            divinationType={divinationType}
            dice={divinationType !== 'runes' ? dice : []}
            diceSum={currentDiceSum}
            diceLore={currentDiceLore}
            runes={divinationType !== 'dice' ? runes : []}
            reading={reading}
            isLoading={isLoadingReading}
            onSaveToGrimoire={handleSaveToGrimoire}
            isSaved={isSavedInGrimoire}
            onNewInquiry={handleNewInquiry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/80 py-8 px-6 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Cleromancy: Sacred Cavern Oracle · ศาสตร์เสี่ยงทายสุ่มเพื่อเป็นเข็มทิศชีวิตและสติปัญญา
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setIsCompendiumOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              ตำราพยากรณ์
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              คลังประวัติ ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GrimoireHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onDeleteEntry={handleDeleteHistoryEntry}
        onClearAll={handleClearHistory}
      />

      <CleromancyCompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
      />
    </div>
  );
}
