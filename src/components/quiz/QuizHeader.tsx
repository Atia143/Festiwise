'use client';

import { useQuiz } from './QuizContext';
import { EnhancedProgressBar } from './ui/EnhancedProgressBar';

export default function QuizHeader({ totalSteps = 8 }: { totalSteps?: number }) {
  const { state } = useQuiz();

  return (
    <div className="mb-4">
      <EnhancedProgressBar currentStep={state.currentStep} totalSteps={totalSteps} />
    </div>
  );
}
