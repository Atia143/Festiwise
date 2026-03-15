'use client';

import { useQuiz } from '@/components/quiz/QuizContext';

export default function QuizLanding() {
  const { state } = useQuiz();

  // Hide once quiz is completed so FestivalResults shows cleanly
  if (state.isCompleted) return null;

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <p className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-5">
          Free · 5 Questions · No sign-up
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Find your perfect<br className="hidden sm:block" /> festival match.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Tell us your music taste, budget, and travel window. We match you with festivals from our database of 100+ worldwide events — in under 2 minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500 mb-10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
            50,000+ festival lovers matched
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
            100+ festivals worldwide
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
            Completely free, always
          </span>
        </div>

        <a
          href="#quiz"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300"
        >
          Start the quiz
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <p className="mt-4 text-xs text-gray-400">
          No account required. Your answers stay on your device.
        </p>
      </div>
    </section>
  );
}
