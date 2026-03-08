'use client';

import { useState, useEffect, useMemo } from 'react';
import { calculateFestivalScore } from '@/utils/quizScoringAlgorithm';
import type { Festival } from '@/types/festival';

interface SmartMatchResult {
  score: number;      // 0-100
  label: string;      // "Perfect Match", "Great Match", etc.
  tier: 'perfect' | 'great' | 'good' | 'none';
}

interface QuizStorage {
  answers: Parameters<typeof calculateFestivalScore>[1];
  isCompleted?: boolean;
}

function readQuiz(): QuizStorage | null {
  try {
    const raw = localStorage.getItem('festi_quiz_v1');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizStorage;
    // Need at least genres or vibes answered to show smart match
    const a = parsed.answers;
    if (!a || (a.genres.length === 0 && a.vibes.length === 0)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function toTier(score: number): SmartMatchResult['tier'] {
  if (score >= 82) return 'perfect';
  if (score >= 68) return 'great';
  if (score >= 54) return 'good';
  return 'none';
}

function toLabel(tier: SmartMatchResult['tier'], score: number): string {
  if (tier === 'perfect') return `${score}% Match`;
  if (tier === 'great') return `${score}% Match`;
  if (tier === 'good') return `${score}% Match`;
  return '';
}

// Hook for a single festival
export function useSmartMatch(festival: Festival): SmartMatchResult | null {
  const [quiz, setQuiz] = useState<QuizStorage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuiz(readQuiz());
  }, []);

  return useMemo(() => {
    if (!mounted || !quiz) return null;
    try {
      const result = calculateFestivalScore(festival, quiz.answers);
      const score = Math.min(99, Math.max(0, result.score));
      const tier = toTier(score);
      if (tier === 'none') return null;
      return { score, label: toLabel(tier, score), tier };
    } catch {
      return null;
    }
  }, [mounted, quiz, festival]);
}

// Hook for scoring all festivals at once (efficient for grid views)
export function useSmartMatchAll(festivals: Festival[]): Map<string, SmartMatchResult> {
  const [quiz, setQuiz] = useState<QuizStorage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuiz(readQuiz());
  }, []);

  return useMemo(() => {
    const map = new Map<string, SmartMatchResult>();
    if (!mounted || !quiz) return map;
    for (const f of festivals) {
      try {
        const result = calculateFestivalScore(f, quiz.answers);
        const score = Math.min(99, Math.max(0, result.score));
        const tier = toTier(score);
        if (tier !== 'none') {
          map.set(f.id, { score, label: toLabel(tier, score), tier });
        }
      } catch {
        // skip
      }
    }
    return map;
  }, [mounted, quiz, festivals]);
}
