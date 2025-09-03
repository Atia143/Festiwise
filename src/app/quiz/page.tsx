'use client';


import { WorldClassQuiz } from '@/components/quiz/WorldClassQuiz';
import { QuizProvider } from '@/components/quiz/QuizContext';

export default function QuizPage() {
  return (
    <QuizProvider>
      <WorldClassQuiz />
    </QuizProvider>
  );
}
