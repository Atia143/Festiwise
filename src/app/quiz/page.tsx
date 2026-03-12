import type { Metadata } from 'next';
import { WorldClassQuiz } from '@/components/quiz/WorldClassQuizV2';
import { QuizProvider } from '@/components/quiz/QuizContext';

export const metadata: Metadata = {
  title: 'Festival Finder Quiz — Discover Your Perfect Match in 2 Minutes | FestiWise',
  description: 'Answer 8 quick questions about your music taste, budget, and travel style. Get personalised festival recommendations from 100+ world-class events worldwide.',
  alternates: { canonical: 'https://getfestiwise.com/quiz' },
  openGraph: {
    title: 'Festival Finder Quiz — Find Your Perfect Festival in 2 Minutes',
    description: 'Free personalised festival recommendations based on your music taste, budget and location.',
    url: 'https://getfestiwise.com/quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Finder Quiz — Find Your Perfect Festival',
    description: 'Free personalised recommendations from 100+ festivals worldwide.',
  },
};

export default function QuizPage() {
  return (
    <QuizProvider>
      <WorldClassQuiz />
    </QuizProvider>
  );
}
