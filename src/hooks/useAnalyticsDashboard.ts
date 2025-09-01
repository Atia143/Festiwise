import { useState, useEffect } from 'react';

interface AnalyticsData {
  quizCompletions: number;
  festivalClicks: number;
  newsletterSignups: number;
  topFestivals: { name: string; clicks: number }[];
  topGenres: { genre: string; selections: number }[];
  userJourney: { step: string; dropOffRate: number }[];
}

export default function useAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from your analytics API
    const fetchAnalytics = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: AnalyticsData = {
          quizCompletions: 1247,
          festivalClicks: 3892,
          newsletterSignups: 456,
          topFestivals: [
            { name: 'Tomorrowland', clicks: 342 },
            { name: 'Coachella', clicks: 298 },
            { name: 'Burning Man', clicks: 267 },
            { name: 'Ultra Europe', clicks: 189 },
            { name: 'Glastonbury', clicks: 178 }
          ],
          topGenres: [
            { genre: 'EDM', selections: 892 },
            { genre: 'Rock', selections: 567 },
            { genre: 'Indie', selections: 445 },
            { genre: 'Pop', selections: 334 },
            { genre: 'Electronic', selections: 298 }
          ],
          userJourney: [
            { step: 'Landing Page', dropOffRate: 0 },
            { step: 'Quiz Start', dropOffRate: 15 },
            { step: 'Genre Selection', dropOffRate: 8 },
            { step: 'Budget Selection', dropOffRate: 12 },
            { step: 'Location Selection', dropOffRate: 6 },
            { step: 'Results Page', dropOffRate: 4 },
            { step: 'Festival Click', dropOffRate: 25 }
          ]
        };
        
        setData(mockData);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const conversionRate = data 
    ? ((data.festivalClicks / data.quizCompletions) * 100).toFixed(1)
    : '0';

  const emailConversionRate = data
    ? ((data.newsletterSignups / data.quizCompletions) * 100).toFixed(1)
    : '0';

  return {
    data,
    loading,
    conversionRate,
    emailConversionRate
  };
}
