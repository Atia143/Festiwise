/**
 * Utility to generate dynamic OG images for social sharing
 * Used for quiz results, festival pages, and blog posts
 */

export function generateQuizResultsOGImage({
  festivalName,
  matchScore,
  genre,
  budget,
  country = 'Global',
}: {
  festivalName: string;
  matchScore: number;
  genre: string;
  budget: string;
  country?: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://getfestiwise.com';
  const params = new URLSearchParams({
    festival: festivalName,
    score: Math.round(matchScore).toString(),
    genre,
    budget,
    country,
  });
  
  return `${baseUrl}/api/og/quiz-results?${params.toString()}`;
}

export function generateFestivalOGImage({
  name,
  genre,
  country,
  month,
  price,
}: {
  name: string;
  genre: string;
  country: string;
  month: string;
  price: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://getfestiwise.com';
  const params = new URLSearchParams({
    name,
    genre,
    country,
    month,
    price,
  });
  
  return `${baseUrl}/api/og/festival?${params.toString()}`;
}

export function generateShareableQuizURL({
  festivalId,
  matchScore,
}: {
  festivalId: string;
  matchScore: number;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://getfestiwise.com';
  const params = new URLSearchParams({
    festival: festivalId,
    score: Math.round(matchScore).toString(),
  });
  
  return `${baseUrl}/quiz?${params.toString()}`;
}
