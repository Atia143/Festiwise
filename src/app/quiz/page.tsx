'use client';

import { WorldClassQuiz } from '@/components/quiz/WorldClassQuizV2';
import { QuizProvider } from '@/components/quiz/QuizContext';

export default function QuizPage() {
  return (
    <QuizProvider>
      <WorldClassQuiz />
    </QuizProvider>
  );
}
