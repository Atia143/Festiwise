'use client';

import dynamic from 'next/dynamic';
import { QuizProvider } from '@/components/quiz/QuizContext';

// Dynamically import the SimpleQuiz component with SSR disabled
const SimpleQuiz = dynamic(
  () => import('@/components/quiz/SimpleQuiz').then(mod => ({ default: mod.SimpleQuiz })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
);

export default function QuizPage() {
  return (
    <QuizProvider>
      <SimpleQuiz />
    </QuizProvider>
  );
}
