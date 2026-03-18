import type { Metadata } from 'next';
import { WorldClassQuiz } from '@/components/quiz/WorldClassQuizV2';
import { QuizProvider } from '@/components/quiz/QuizContext';
import QuizLanding from './QuizLanding';

export const metadata: Metadata = {
  title: 'Festival Finder Quiz — Find Your Perfect Festival in 2 Minutes',
  description: 'Answer 5 quick questions about your music taste, budget, and travel style. Get personalised festival recommendations from 100+ world-class events worldwide. Free, no sign-up needed.',
  alternates: { canonical: 'https://getfestiwise.com/quiz' },
  openGraph: {
    title: 'Festival Finder Quiz — Discover Your Perfect Festival Match',
    description: 'Free personalised festival recommendations based on your music taste, budget and travel preferences. 100+ festivals worldwide.',
    url: 'https://getfestiwise.com/quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Finder Quiz — Find Your Perfect Festival',
    description: 'Free personalised recommendations from 100+ festivals worldwide. 2 minutes, no sign-up.',
  },
};

export default function QuizPage() {
  return (
    <QuizProvider>
      {/* Landing hides itself once quiz completes */}
      <QuizLanding />
      {/* Quiz renders results in-place when completed */}
      <WorldClassQuiz />
    </QuizProvider>
  );
}
