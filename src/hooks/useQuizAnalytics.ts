'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/components/quiz/QuizContext';
import { 
  trackQuizStart,
  trackQuizComplete,
  trackMatchView,
  trackOutboundClick,
  calculateTimeToComplete
} from '@/lib/analytics-tracker';

/**
 * Custom hook to track quiz analytics throughout the user journey
 */
export function useQuizAnalytics() {
  const { state } = useQuiz();
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const hasTrackedStart = useRef(false);
  const hasTrackedComplete = useRef(false);
  const hasTrackedMatchView = useRef(false);

  // Track quiz start when the component mounts
  useEffect(() => {
    // Only track the quiz start once per session
    if (!hasTrackedStart.current) {
      setQuizStartTime(Date.now());
      trackQuizStart(window.location.pathname.includes('/browse') ? 'browse' : 'home');
      hasTrackedStart.current = true;
    }
  }, []);

  // Track quiz completion
  useEffect(() => {
    if (state.isCompleted && !hasTrackedComplete.current && quizStartTime) {
      const timeToComplete = calculateTimeToComplete(quizStartTime);
      const numQuestions = Object.keys(state.answers).filter(key => 
        state.answers[key as keyof typeof state.answers] !== null &&
        state.answers[key as keyof typeof state.answers] !== undefined &&
        // Filter out empty arrays
        (
          !Array.isArray(state.answers[key as keyof typeof state.answers]) || 
          (state.answers[key as keyof typeof state.answers] as any[]).length > 0
        )
      ).length;
      
      trackQuizComplete(timeToComplete, numQuestions);
      hasTrackedComplete.current = true;
    }
  }, [state.isCompleted, quizStartTime, state.answers]);

  // Function to track match view
  const trackMatchResults = (matches: any[]) => {
    if (!hasTrackedMatchView.current && matches.length > 0) {
      // Find the top match
      const topMatch = matches.reduce((max, match) => 
        (match.matchScore || match.score || 0) > (max.matchScore || max.score || 0) ? match : max, 
        matches[0]
      );
      
      const topMatchId = topMatch.festival?.id || 'unknown';
      const topMatchScore = topMatch.matchScore || topMatch.score || topMatch.normalizedScore || 0;
      
      trackMatchView(matches.length, topMatchId, topMatchScore);
      hasTrackedMatchView.current = true;
    }
  };

  // Function to track outbound clicks to festival websites or ticket pages
  const trackFestivalOutboundClick = (festivalId: string, destinationUrl: string, matchScore?: number) => {
    trackOutboundClick(festivalId, destinationUrl, matchScore);
  };

  return {
    trackMatchResults,
    trackFestivalOutboundClick,
  };
}
