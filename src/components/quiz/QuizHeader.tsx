'use client';

import React, { useEffect, useState } from 'react';
import { useQuiz } from './QuizContext';
import { EnhancedProgressBar } from './ui/EnhancedProgressBar';
import { QuizTimer } from './ui/QuizTimer';
import { useToast } from '../Toast/ToastProvider';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';

export default function QuizHeader({ totalSteps = 8 }: { totalSteps?: number }) {
  const { state, resetTime, dispatch } = useQuiz();
  const { addToast } = useToast();
  const { trackQuizSaved, trackQuizResumed } = useQuizAnalytics();
  
  // State initialization (was missing before)
  const [isSaved, setIsSaved] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [resumePayload, setResumePayload] = useState<any | null>(null);

  useEffect(() => {
    // Detect saved quiz on component mount
    try {
      const raw = typeof window !== 'undefined' && window.localStorage.getItem('festi_quiz_v1');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setResumePayload(parsed);
        } catch (e) {
          setResumePayload(null);
        }
      } else {
        setResumePayload(null);
      }
    } catch (e) {
      setResumePayload(null);
    }
  }, [state.currentStep]);

  const handleSaveNow = () => {
    try {
      const payload = JSON.stringify({
        answers: state.answers,
        currentStep: state.currentStep,
        timeSpent: state.timeSpent,
        savedAt: Date.now(),
      });
      window.localStorage.setItem('festi_quiz_v1', payload);
      setIsSaved(true);
      addToast('✓ Quiz progress saved', 'success', 2000);
      trackQuizSaved(state.timeSpent);
      setTimeout(() => setIsSaved(false), 1500);
    } catch (e) {
      addToast('Failed to save quiz', 'error', 2000);
    }
  };

  const handleClear = () => {
    try {
      window.localStorage.removeItem('festi_quiz_v1');
      setIsSaved(false);
      setResumePayload(null);
      addToast('Quiz cleared', 'info', 1500);
    } catch (e) {
      // ignore
    }
  };

  const handleResume = () => {
    if (!resumePayload) return;
    try {
      if (resumePayload.answers) {
        dispatch({ type: 'SET_BULK_ANSWERS', answers: resumePayload.answers });
      }
      if (typeof resumePayload.currentStep === 'number') {
        dispatch({ type: 'SET_STEP', step: resumePayload.currentStep });
      }
      if (typeof resumePayload.timeSpent === 'number') {
        dispatch({ type: 'SET_TIME', value: resumePayload.timeSpent });
      }
      setResumePayload(null);
      addToast('✓ Quiz resumed from your last session', 'info', 2000);
      trackQuizResumed(resumePayload.timeSpent);
    } catch (e) {
      addToast('Failed to resume quiz', 'error', 2000);
    }
  };

  return (
    <div className="mb-6">
      {resumePayload && state.currentStep === 0 && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-between">
          <div className="text-sm text-yellow-900">
            You have a saved quiz — resume where you left off?
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1 rounded-md bg-yellow-600 text-white text-sm hover:bg-yellow-700 transition-colors"
              aria-label="Resume saved quiz"
            >
              Resume
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 rounded-md bg-white/10 text-sm hover:bg-white/20 transition-colors"
              aria-label="Clear saved quiz"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex-1">
          <EnhancedProgressBar currentStep={state.currentStep} totalSteps={totalSteps} />
        </div>
        <div className="ml-4 flex items-center gap-3">
          <QuizTimer seconds={state.timeSpent} onReset={() => resetTime()} isActive={timerActive} />
          <button
            onClick={handleSaveNow}
            className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-colors focus:outline-none"
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Quiz saved' : 'Save quiz progress'}
          >
            {isSaved ? '✓ Saved' : 'Save'}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Clear quiz progress"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
