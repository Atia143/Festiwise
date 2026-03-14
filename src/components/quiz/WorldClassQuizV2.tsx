'use client';

import { useQuiz } from './QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { FestivalResults } from './FestivalResults';

// ============================================================
// FESTIWISE QUIZ — Rebuilt
// 5 steps · Mobile-first · Clean UX
// ============================================================

const STEPS = [
  { id: 'genres', label: 'Music',   title: 'What music moves you?',          subtitle: 'Pick everything that gets you going — more picks means better matches.' },
  { id: 'vibes',  label: 'Vibe',    title: 'What kind of experience?',        subtitle: 'What does your ideal festival feel like?' },
  { id: 'budget', label: 'Budget',  title: 'How much are you investing?',     subtitle: 'Total budget: tickets, travel, accommodation, food.' },
  { id: 'region', label: 'Region',  title: 'Where in the world?',            subtitle: 'You can always filter further after you see your matches.' },
  { id: 'when',   label: 'When',    title: 'When can you go?',               subtitle: 'Pick your months or leave flexible — we\'ll find options either way.' },
];

const GENRES = [
  { id: 'EDM',       label: 'Electronic / EDM',   sub: 'Techno · House · Trance',    accent: 'bg-violet-500' },
  { id: 'Rock',      label: 'Rock & Metal',        sub: 'Classic · Punk · Metal',     accent: 'bg-red-500' },
  { id: 'Pop',       label: 'Pop & Mainstream',    sub: 'Chart · Dance Pop',          accent: 'bg-pink-500' },
  { id: 'Hip-Hop',   label: 'Hip-Hop & R&B',       sub: 'Rap · Trap · R&B',          accent: 'bg-yellow-500' },
  { id: 'Indie',     label: 'Indie & Alternative', sub: 'Art Rock · Experimental',    accent: 'bg-teal-500' },
  { id: 'Jazz',      label: 'Jazz & Blues',        sub: 'Jazz · Blues · Soul',        accent: 'bg-blue-500' },
  { id: 'World',     label: 'World Music',         sub: 'Folk · Ethnic · Fusion',     accent: 'bg-green-500' },
  { id: 'Reggae',    label: 'Reggae & Caribbean',  sub: 'Reggae · Dancehall · Ska',   accent: 'bg-lime-500' },
  { id: 'Latin',     label: 'Latin & Salsa',       sub: 'Salsa · Reggaeton · Cumbia', accent: 'bg-orange-500' },
  { id: 'Classical', label: 'Classical',           sub: 'Symphony · Opera · Chamber', accent: 'bg-slate-400' },
  { id: 'Afrobeats', label: 'Afrobeats',           sub: 'Afrobeats · Amapiano',       accent: 'bg-amber-600' },
  { id: 'Ambient',   label: 'Ambient & Chill',     sub: 'Downtempo · Meditation',     accent: 'bg-purple-400' },
];

const VIBES = [
  { id: 'party',     label: 'Party Hard',          desc: 'Non-stop energy, dancing till dawn, massive crowd.',                   icon: '⚡' },
  { id: 'chill',     label: 'Laid-back & Chill',   desc: 'Good music, good people, no rush.',                                    icon: '🌊' },
  { id: 'immersive', label: 'Immersive & Artsy',   desc: 'Interactive art, themed worlds, creative experiences.',                icon: '🎨' },
  { id: 'discovery', label: 'Discover New Music',  desc: 'Underground acts, emerging artists, sounds you haven\'t heard yet.',  icon: '🔭' },
  { id: 'cultural',  label: 'Culture & Roots',     desc: 'Local traditions, authentic sounds, meaningful connections.',          icon: '🌍' },
  { id: 'vip',       label: 'Comfort & Luxury',    desc: 'Premium access, comfortable stays, elevated experience.',              icon: '✦' },
];

const BUDGETS = [
  { id: 'ultra-budget', label: 'Budget',      range: { min: 0,    max: 500   }, amount: 'Under $500',      note: 'Local festivals, camping, early-bird deals' },
  { id: 'budget',       label: 'Mid-range',   range: { min: 500,  max: 1200  }, amount: '$500 – $1,200',   note: 'Regional festivals, hostels, some extras' },
  { id: 'moderate',     label: 'Comfortable', range: { min: 1200, max: 2500  }, amount: '$1,200 – $2,500', note: 'Major festivals, good hotels, VIP perks' },
  { id: 'luxury',       label: 'Premium',     range: { min: 2500, max: 10000 }, amount: '$2,500+',          note: 'Top-tier festivals, luxury stays, exclusive access' },
];

const REGIONS = [
  { id: 'north-america', label: 'North America',        flag: '🗽', note: 'Coachella, Lollapalooza, Burning Man' },
  { id: 'europe',        label: 'Europe',               flag: '🏰', note: 'Glastonbury, Tomorrowland, Primavera' },
  { id: 'south-america', label: 'South America',        flag: '🌴', note: 'Carnival, Sónar Buenos Aires' },
  { id: 'asia-pacific',  label: 'Asia & Pacific',       flag: '🏮', note: 'Fuji Rock, Splendour in the Grass' },
  { id: 'middle-east',   label: 'Middle East & Africa', flag: '🏜️', note: 'Desert festivals, emerging scene' },
  { id: 'caribbean',     label: 'Caribbean',            flag: '🏝️', note: 'Reggae Fest, island vibes' },
  { id: 'local',         label: 'Local / Anywhere',     flag: '📍', note: 'Show me everything' },
];

const MONTHS = [
  { id: 'January',   label: 'Jan' },
  { id: 'February',  label: 'Feb' },
  { id: 'March',     label: 'Mar' },
  { id: 'April',     label: 'Apr' },
  { id: 'May',       label: 'May' },
  { id: 'June',      label: 'Jun' },
  { id: 'July',      label: 'Jul' },
  { id: 'August',    label: 'Aug' },
  { id: 'September', label: 'Sep' },
  { id: 'October',   label: 'Oct' },
  { id: 'November',  label: 'Nov' },
  { id: 'December',  label: 'Dec' },
];

const DURATION_OPTIONS = [
  { id: 'day',     label: 'Day Festival', desc: '8–12 hrs' },
  { id: 'weekend', label: 'Weekend',      desc: '2–3 days' },
  { id: 'week+',   label: 'Full Week+',   desc: '5+ days' },
];

const EXTRAS = [
  { id: 'camping',    label: 'Camping' },
  { id: 'glamping',   label: 'Glamping' },
  { id: 'family',     label: 'Family friendly' },
  { id: 'accessible', label: 'Wheelchair accessible' },
  { id: 'vegan',      label: 'Vegan food' },
  { id: 'sober',      label: 'Sober friendly' },
];

// Step indicator
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-2 bg-purple-600'
                  : i < current
                  ? 'w-2 h-2 bg-purple-400'
                  : 'w-2 h-2 bg-gray-200'
              }`}
            />
            <span
              className={`text-xs font-medium hidden sm:block transition-colors duration-200 ${
                i === current ? 'text-purple-700' : i < current ? 'text-purple-400' : 'text-gray-300'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`w-4 h-px mx-0.5 ${i < current ? 'bg-purple-300' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Checkmark icon
function Check() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function WorldClassQuiz() {
  const { state, setAnswer, nextStep, prevStep, completeQuiz, resetQuiz } = useQuiz();
  const [nudge, setNudge] = useState(false);

  const ALL_MONTHS = MONTHS.map(m => m.id);

  // All hooks must be declared before any conditional returns
  const isGenreSelected  = useCallback((id: string) => state.answers.genres.includes(id), [state.answers.genres]);
  const isVibeSelected   = useCallback((id: string) => state.answers.vibes.includes(id), [state.answers.vibes]);
  const isMonthSelected  = useCallback((id: string) => state.answers.months.includes(id), [state.answers.months]);
  const isExtraSelected  = useCallback((id: string) => (state.answers.accessibility || []).includes(id), [state.answers.accessibility]);

  // Guard: stale localStorage from old quiz (7 steps) can have currentStep > 4.
  // Reset silently so the user starts fresh instead of crashing.
  if (!state.isCompleted && state.currentStep >= STEPS.length) {
    resetQuiz();
    return null;
  }

  const toggleGenre = (id: string) => {
    const curr = state.answers.genres;
    setAnswer('genres', curr.includes(id) ? curr.filter((g: string) => g !== id) : [...curr, id]);
  };

  const toggleVibe = (id: string) => {
    const curr = state.answers.vibes;
    setAnswer('vibes', curr.includes(id) ? curr.filter((v: string) => v !== id) : [...curr, id]);
  };

  const toggleMonth = (id: string) => {
    const curr = state.answers.months;
    setAnswer('months', curr.includes(id) ? curr.filter((m: string) => m !== id) : [...curr, id]);
  };

  const toggleAllMonths = () => {
    const allSel = ALL_MONTHS.every(m => state.answers.months.includes(m));
    setAnswer('months', allSel ? [] : ALL_MONTHS);
  };

  const toggleExtra = (id: string) => {
    const curr: string[] = state.answers.accessibility || [];
    setAnswer('accessibility', curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]);
  };

  const budgetSelected = BUDGETS.some(
    b => b.range.min === state.answers.budget.min && b.range.max === state.answers.budget.max
  );

  const canAdvance = () => {
    const s = state.currentStep;
    if (s === 0) return state.answers.genres.length > 0;
    if (s === 1) return state.answers.vibes.length > 0;
    if (s === 2) return budgetSelected;
    if (s === 3) return !!state.answers.region;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      setNudge(true);
      setTimeout(() => setNudge(false), 1800);
      return;
    }
    if (state.currentStep < STEPS.length - 1) nextStep();
    else completeQuiz();
  };

  const handleBudget = (budget: typeof BUDGETS[0]) => {
    setAnswer('budget', budget.range);
    setTimeout(() => {
      if (state.currentStep < STEPS.length - 1) nextStep();
      else completeQuiz();
    }, 180);
  };

  const handleRegion = (id: string) => {
    setAnswer('region', id);
    setTimeout(() => {
      if (state.currentStep < STEPS.length - 1) nextStep();
      else completeQuiz();
    }, 180);
  };

  if (state.isCompleted) return <FestivalResults />;

  const step = STEPS[state.currentStep];

  return (
    <div className="min-h-screen bg-white" id="quiz">
      {/* Sticky step header */}
      <div className="sticky top-[65px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <StepIndicator current={state.currentStep} total={STEPS.length} />
          <span className="text-xs text-gray-400 font-medium shrink-0">
            {state.currentStep + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Question header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {step.title}
              </h2>
              <p className="text-base text-gray-500">{step.subtitle}</p>
            </div>

            {/* Validation nudge */}
            <AnimatePresence>
              {nudge && (
                <motion.p
                  key="nudge"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-amber-600 font-medium mb-5"
                >
                  Pick at least one option to continue.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Step 0 — Genre */}
            {state.currentStep === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GENRES.map(genre => {
                  const sel = isGenreSelected(genre.id);
                  return (
                    <motion.button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-150 touch-manipulation ${
                        sel
                          ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {sel && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute top-2.5 right-2.5 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                        >
                          <Check />
                        </motion.div>
                      )}
                      <div className={`w-7 h-1 rounded-full mb-3 ${genre.accent}`} />
                      <p className="font-semibold text-sm text-gray-900 leading-snug">{genre.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{genre.sub}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 1 — Vibe */}
            {state.currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VIBES.map(vibe => {
                  const sel = isVibeSelected(vibe.id);
                  return (
                    <motion.button
                      key={vibe.id}
                      onClick={() => toggleVibe(vibe.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-150 touch-manipulation ${
                        sel
                          ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl leading-none mt-0.5 shrink-0">{vibe.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{vibe.label}</p>
                        <p className="text-sm text-gray-500 mt-0.5 leading-snug">{vibe.desc}</p>
                      </div>
                      {sel && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="shrink-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                        >
                          <Check />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 2 — Budget */}
            {state.currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BUDGETS.map(budget => {
                  const sel = state.answers.budget.min === budget.range.min && state.answers.budget.max === budget.range.max;
                  return (
                    <motion.button
                      key={budget.id}
                      onClick={() => handleBudget(budget)}
                      whileTap={{ scale: 0.97 }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-150 touch-manipulation ${
                        sel
                          ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{budget.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{budget.amount}</p>
                      <p className="text-sm text-gray-500">{budget.note}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 3 — Region */}
            {state.currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {REGIONS.map(region => {
                  const sel = state.answers.region === region.id;
                  return (
                    <motion.button
                      key={region.id}
                      onClick={() => handleRegion(region.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-150 touch-manipulation ${
                        sel
                          ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl shrink-0 leading-none mt-0.5">{region.flag}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{region.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{region.note}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 4 — When */}
            {state.currentStep === 4 && (
              <div className="space-y-10">
                {/* Month picker */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Preferred months</p>
                    <button
                      onClick={toggleAllMonths}
                      className="text-xs text-purple-600 font-medium hover:underline"
                    >
                      {ALL_MONTHS.every(m => state.answers.months.includes(m)) ? 'Clear all' : 'Any time'}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {MONTHS.map(month => {
                      const sel = isMonthSelected(month.id);
                      return (
                        <motion.button
                          key={month.id}
                          onClick={() => toggleMonth(month.id)}
                          whileTap={{ scale: 0.93 }}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-all duration-150 touch-manipulation ${
                            sel
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {month.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Festival length</p>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATION_OPTIONS.map(dur => {
                      const sel = state.answers.duration === dur.id;
                      return (
                        <motion.button
                          key={dur.id}
                          onClick={() => setAnswer('duration', dur.id)}
                          whileTap={{ scale: 0.96 }}
                          className={`py-4 px-3 rounded-2xl border-2 text-center transition-all duration-150 touch-manipulation ${
                            sel
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <p className="font-semibold text-sm text-gray-900">{dur.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{dur.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional extras */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Any must-haves?{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {EXTRAS.map(extra => {
                      const sel = isExtraSelected(extra.id);
                      return (
                        <motion.button
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-150 touch-manipulation ${
                            sel
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {extra.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          {/* Back */}
          <motion.button
            onClick={() => prevStep()}
            disabled={state.currentStep === 0}
            whileTap={state.currentStep > 0 ? { scale: 0.96 } : {}}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              state.currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          {/* Skip (last step only) */}
          {state.currentStep === STEPS.length - 1 && (
            <button
              onClick={() => completeQuiz()}
              className="text-sm text-gray-400 hover:text-gray-600 font-medium px-3"
            >
              Skip
            </button>
          )}

          {/* Continue / Finish */}
          <motion.button
            onClick={handleNext}
            whileTap={canAdvance() ? { scale: 0.97 } : {}}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ml-auto ${
              canAdvance()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {state.currentStep === STEPS.length - 1 ? 'Show my matches' : 'Continue'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
