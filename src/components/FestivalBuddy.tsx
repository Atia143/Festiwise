'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, X, ChevronRight, Sparkles } from 'lucide-react';
import { calculateFestivalScore } from '@/utils/quizScoringAlgorithm';
import type { Festival } from '@/types/festival';
import rawFestivals from '@/data/festivals.json';

const allFestivals = rawFestivals as Festival[];

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-');
}

const SUMMER_MONTHS = new Set(['June', 'July', 'August']);
const EUROPE_REGIONS = new Set(['Europe', 'Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe']);

function getTrendingScore(f: Festival): number {
  const w: Record<string, number> = { small: 1, medium: 2, large: 3, massive: 4 };
  return (w[f.audience_size] ?? 2) * f.duration_days * (f.genres.length > 2 ? 1.2 : 1);
}

interface BuddyMessage {
  role: 'assistant' | 'user';
  text: string;
  links?: { label: string; href: string }[];
}

// ── Answer engines ─────────────────────────────────────────────────────────────

function answerSummer(): BuddyMessage {
  const summer = allFestivals
    .filter(f => f.status === 'active' && f.months.some(m => SUMMER_MONTHS.has(m)))
    .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
    .slice(0, 3);

  return {
    role: 'assistant',
    text: `Here are the top summer festivals in the database right now:`,
    links: summer.map(f => ({
      label: `${f.name} — ${f.city}, ${f.country} (${f.months.filter(m => SUMMER_MONTHS.has(m)).join(', ')})`,
      href: `/festival/${f.id}`,
    })),
  };
}

function answerCheapest(): BuddyMessage {
  const cheap = [...allFestivals]
    .filter(f => f.status === 'active')
    .sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min)
    .slice(0, 3);

  return {
    role: 'assistant',
    text: `The most budget-friendly festivals in our database:`,
    links: cheap.map(f => ({
      label: `${f.name} — from $${f.estimated_cost_usd.min.toLocaleString()} total`,
      href: `/festival/${f.id}`,
    })),
  };
}

function answerEurope(): BuddyMessage {
  const europe = allFestivals
    .filter(f => f.status === 'active' && (EUROPE_REGIONS.has(f.region ?? '') || f.country === 'UK' || f.country === 'Germany' || f.country === 'Spain' || f.country === 'France' || f.country === 'Netherlands' || f.country === 'Belgium' || f.country === 'Portugal' || f.country === 'Sweden' || f.country === 'Denmark' || f.country === 'Poland'))
    .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
    .slice(0, 3);

  return {
    role: 'assistant',
    text: `Top European festivals right now:`,
    links: europe.map(f => ({
      label: `${f.name} — ${f.city}, ${f.country}`,
      href: `/festival/${f.id}`,
    })),
  };
}

function answerBestForMe(): BuddyMessage {
  try {
    const raw = localStorage.getItem('festi_quiz_v1');
    if (raw) {
      const { answers } = JSON.parse(raw);
      if (answers && (answers.genres.length > 0 || answers.vibes.length > 0)) {
        const top = allFestivals
          .filter(f => f.status === 'active')
          .map(f => {
            try { return { f, score: calculateFestivalScore(f, answers).score }; }
            catch { return { f, score: 0 }; }
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        return {
          role: 'assistant',
          text: `Based on your quiz results, here are your top matches:`,
          links: top.map(({ f, score }) => ({
            label: `${f.name} — ${Math.min(99, Math.round(score))}% match`,
            href: `/festival/${f.id}`,
          })),
        };
      }
    }
  } catch {
    // fall through
  }

  return {
    role: 'assistant',
    text: `Take the 2-minute quiz and I'll find your perfect festival match instantly!`,
    links: [{ label: 'Take the quiz now →', href: '/quiz' }],
  };
}

// ── Preset questions ───────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Best for me this summer?',    answer: answerSummer },
  { label: 'Which are cheapest right now?', answer: answerCheapest },
  { label: 'Best festivals in Europe?',   answer: answerEurope },
  { label: 'Find my perfect match',       answer: answerBestForMe },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function FestivalBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BuddyMessage[]>([
    {
      role: 'assistant',
      text: "Hi! I'm your Festival Buddy. Ask me anything about our festival lineup.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [usedPresets, setUsedPresets] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function handlePreset(idx: number) {
    const preset = PRESETS[idx];
    setUsedPresets(prev => new Set([...prev, idx]));

    const userMsg: BuddyMessage = { role: 'user', text: preset.label };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, preset.answer()]);
    }, 700);
  }

  const unusedPresets = PRESETS.filter((_, i) => !usedPresets.has(i));

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="buddy-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            aria-label="Open Festival Buddy"
            className="fixed bottom-20 left-4 z-[9990] w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform touch-manipulation tap-highlight-none"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="buddy-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-20 left-4 z-[9990] w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden"
            style={{ maxHeight: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Festival Buddy</p>
                  <p className="text-white/60 text-[10px]">Powered by our festival database</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Festival Buddy"
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="leading-snug">{msg.text}</p>
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.links.map((l, j) => (
                          <Link
                            key={j}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="flex items-start gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white rounded-xl px-2.5 py-2 border border-purple-100 hover:border-purple-300 transition-colors"
                          >
                            <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-snug">{l.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preset question buttons */}
            {unusedPresets.length > 0 && (
              <div className="px-3 pb-3 space-y-1.5 border-t border-gray-100 pt-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-1">Ask me:</p>
                {unusedPresets.slice(0, 3).map((preset) => {
                  const originalIdx = PRESETS.indexOf(preset);
                  return (
                    <button
                      key={originalIdx}
                      onClick={() => handlePreset(originalIdx)}
                      className="w-full text-left text-xs font-medium text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl px-3 py-2.5 transition-colors border border-gray-200 hover:border-purple-200 touch-manipulation tap-highlight-none"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
