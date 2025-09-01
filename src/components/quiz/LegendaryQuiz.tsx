'use client';

import { useQuiz } from './QuizContext';
import { WorldClassResults } from './WorldClassResults';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 }
};

const pageTransition = {
  type: "spring",
  duration: 0.4
} as const;

export function WorldClassQuiz() {
  const { state, setAnswer, nextStep, prevStep, completeQuiz } = useQuiz();
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentStepStartTime, setCurrentStepStartTime] = useState(Date.now());

  // Calculate progress
  useEffect(() => {
    const totalSteps = 8; // Updated for comprehensive quiz
    setProgress((state.currentStep / totalSteps) * 100);
  }, [state.currentStep]);

  // Track time spent per question (for analytics)
  useEffect(() => {
    setCurrentStepStartTime(Date.now());
  }, [state.currentStep]);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (state.isCompleted) {
    return <WorldClassResults />;
  }

  // LEGENDARY DATA - More comprehensive than any competitor
  const quizSteps = [
    {
      id: 'genres',
      title: 'What music genres move your soul?',
      subtitle: 'Select all that make you feel alive (multiple selections get better matches)',
      type: 'multiGenre',
      icon: '🎵',
      data: [
        { 
          id: 'EDM', 
          label: 'Electronic/EDM', 
          emoji: '🎧', 
          subgenres: ['Techno', 'House', 'Trance', 'Dubstep', 'Progressive'],
          mood: 'energetic',
          vibe: 'futuristic',
          popularity: 95
        },
        { 
          id: 'Rock', 
          label: 'Rock & Metal', 
          emoji: '🎸', 
          subgenres: ['Classic Rock', 'Metal', 'Punk', 'Alternative', 'Indie Rock'],
          mood: 'powerful',
          vibe: 'rebellious',
          popularity: 88
        },
        { 
          id: 'Pop', 
          label: 'Pop & Mainstream', 
          emoji: '🎤', 
          subgenres: ['Chart Hits', 'Dance Pop', 'Commercial', 'Radio Friendly'],
          mood: 'uplifting',
          vibe: 'mainstream',
          popularity: 92
        },
        { 
          id: 'Hip-Hop', 
          label: 'Hip-Hop & Rap', 
          emoji: '🎵', 
          subgenres: ['Rap', 'Trap', 'R&B', 'Urban', 'Conscious Hip-Hop'],
          mood: 'urban',
          vibe: 'street',
          popularity: 90
        },
        { 
          id: 'Indie', 
          label: 'Indie & Alternative', 
          emoji: '🎭', 
          subgenres: ['Independent', 'Art Rock', 'Experimental', 'Shoegaze'],
          mood: 'creative',
          vibe: 'artistic',
          popularity: 75
        },
        { 
          id: 'Jazz', 
          label: 'Jazz & Blues', 
          emoji: '🎺', 
          subgenres: ['Traditional Jazz', 'Modern Jazz', 'Blues', 'Soul', 'Funk'],
          mood: 'sophisticated',
          vibe: 'classy',
          popularity: 65
        },
        { 
          id: 'World', 
          label: 'World Music', 
          emoji: '🌍', 
          subgenres: ['Folk', 'Traditional', 'Ethnic', 'World Fusion'],
          mood: 'cultural',
          vibe: 'authentic',
          popularity: 70
        },
        { 
          id: 'Classical', 
          label: 'Classical & Orchestra', 
          emoji: '🎼', 
          subgenres: ['Symphony', 'Chamber', 'Opera', 'Contemporary Classical'],
          mood: 'elegant',
          vibe: 'refined',
          popularity: 55
        },
        { 
          id: 'Reggae', 
          label: 'Reggae & Caribbean', 
          emoji: '🇯🇲', 
          subgenres: ['Reggae', 'Dancehall', 'Ska', 'Dub', 'Calypso'],
          mood: 'relaxed',
          vibe: 'island',
          popularity: 68
        },
        { 
          id: 'Latin', 
          label: 'Latin & Salsa', 
          emoji: '💃', 
          subgenres: ['Salsa', 'Bachata', 'Reggaeton', 'Brazilian', 'Cumbia'],
          mood: 'passionate',
          vibe: 'dance',
          popularity: 78
        },
        { 
          id: 'Ambient', 
          label: 'Ambient & Chill', 
          emoji: '🧘', 
          subgenres: ['Downtempo', 'Chillout', 'Meditation', 'New Age'],
          mood: 'peaceful',
          vibe: 'zen',
          popularity: 60
        },
        { 
          id: 'Afrobeats', 
          label: 'Afrobeats & African', 
          emoji: '🥁', 
          subgenres: ['Afrobeats', 'Highlife', 'Amapiano', 'African Traditional'],
          mood: 'rhythmic',
          vibe: 'tribal',
          popularity: 82
        }
      ]
    },
    {
      id: 'budget',
      title: 'What\'s your festival investment?',
      subtitle: 'Including tickets, travel, accommodation, and experiences',
      type: 'budget',
      icon: '💰',
      data: [
        { 
          id: 'ultra-budget', 
          label: 'Ultra Budget', 
          range: { min: 0, max: 500 }, 
          emoji: '🎒', 
          description: 'Camping, local festivals, shared accommodations',
          tips: ['Look for early bird tickets', 'Consider camping options', 'Share transport costs'],
          currencies: { 
            USD: '$0-500', 
            EUR: '€0-400', 
            GBP: '£0-350', 
            AUD: 'A$0-650',
            CAD: 'C$0-600'
          },
          examples: ['Local music festivals', 'Camping events', 'Student discounts']
        },
        { 
          id: 'budget', 
          label: 'Budget-Conscious', 
          range: { min: 500, max: 1200 }, 
          emoji: '💰', 
          description: 'Standard tickets, budget accommodation, some extras',
          tips: ['Book early for best prices', 'Consider hostels', 'Budget for food'],
          currencies: { 
            USD: '$500-1.2K', 
            EUR: '€400-1K', 
            GBP: '£350-900', 
            AUD: 'A$650-1.6K',
            CAD: 'C$600-1.5K'
          },
          examples: ['Regional festivals', 'Standard tickets', 'Budget hotels']
        },
        { 
          id: 'moderate', 
          label: 'Comfortable', 
          range: { min: 1200, max: 3000 }, 
          emoji: '💳', 
          description: 'Good tickets, comfortable stay, dining experiences',
          tips: ['Compare package deals', 'Book accommodations early', 'Include meal budget'],
          currencies: { 
            USD: '$1.2K-3K', 
            EUR: '€1K-2.5K', 
            GBP: '£900-2.2K', 
            AUD: 'A$1.6K-4K',
            CAD: 'C$1.5K-3.8K'
          },
          examples: ['Multi-day festivals', 'Hotel stays', 'Dining experiences']
        },
        { 
          id: 'premium', 
          label: 'Premium Experience', 
          range: { min: 3000, max: 7000 }, 
          emoji: '💎', 
          description: 'VIP access, luxury stays, exclusive experiences',
          tips: ['Book VIP packages early', 'Consider luxury transfers', 'Plan exclusive experiences'],
          currencies: { 
            USD: '$3K-7K', 
            EUR: '€2.5K-6K', 
            GBP: '£2.2K-5.5K', 
            AUD: 'A$4K-9K',
            CAD: 'C$3.8K-8.5K'
          },
          examples: ['VIP tickets', 'Luxury hotels', 'Artist meet & greets']
        },
        { 
          id: 'luxury', 
          label: 'Ultra Luxury', 
          range: { min: 7000, max: 20000 }, 
          emoji: '👑', 
          description: 'All-inclusive, private access, celebrity treatment',
          tips: ['Book through luxury travel agents', 'Consider private jet packages', 'Plan exclusive after-parties'],
          currencies: { 
            USD: '$7K-20K', 
            EUR: '€6K-17K', 
            GBP: '£5.5K-15K', 
            AUD: 'A$9K-26K',
            CAD: 'C$8.5K-24K'
          },
          examples: ['Private boxes', '5-star resorts', 'Helicopter transfers']
        }
      ]
    },
    {
      id: 'months',
      title: 'When is your festival season?',
      subtitle: 'Select your preferred months (weather and festival seasons vary globally)',
      type: 'multiMonth',
      icon: '📅',
      data: [
        { 
          id: 'January', 
          label: 'January', 
          emoji: '❄️', 
          season: 'Winter', 
          hotDestinations: ['Australia', 'South America', 'Southeast Asia'],
          weatherNote: 'Summer in Southern Hemisphere',
          festivalCount: 45
        },
        { 
          id: 'February', 
          label: 'February', 
          emoji: '💕', 
          season: 'Winter', 
          hotDestinations: ['India', 'Southeast Asia', 'Middle East'],
          weatherNote: 'Dry season in many regions',
          festivalCount: 52
        },
        { 
          id: 'March', 
          label: 'March', 
          emoji: '🌸', 
          season: 'Spring', 
          hotDestinations: ['India', 'USA (South)', 'Middle East'],
          weatherNote: 'Perfect weather in many places',
          festivalCount: 68
        },
        { 
          id: 'April', 
          label: 'April', 
          emoji: '🌷', 
          season: 'Spring', 
          hotDestinations: ['USA', 'Europe (South)', 'Asia'],
          weatherNote: 'Festival season begins',
          festivalCount: 89
        },
        { 
          id: 'May', 
          label: 'May', 
          emoji: '🌺', 
          season: 'Spring', 
          hotDestinations: ['Europe', 'USA', 'Mediterranean'],
          weatherNote: 'Perfect festival weather',
          festivalCount: 112
        },
        { 
          id: 'June', 
          label: 'June', 
          emoji: '☀️', 
          season: 'Summer', 
          hotDestinations: ['Europe', 'UK', 'Scandinavia'],
          weatherNote: 'Peak European season',
          festivalCount: 156
        },
        { 
          id: 'July', 
          label: 'July', 
          emoji: '🏖️', 
          season: 'Summer', 
          hotDestinations: ['Europe', 'UK', 'Canada'],
          weatherNote: 'Warmest weather in Europe',
          festivalCount: 189
        },
        { 
          id: 'August', 
          label: 'August', 
          emoji: '🌞', 
          season: 'Summer', 
          hotDestinations: ['Europe', 'UK', 'Eastern Europe'],
          weatherNote: 'Peak festival season',
          festivalCount: 178
        },
        { 
          id: 'September', 
          label: 'September', 
          emoji: '🍂', 
          season: 'Autumn', 
          hotDestinations: ['Europe', 'USA', 'South America'],
          weatherNote: 'Perfect temperatures',
          festivalCount: 95
        },
        { 
          id: 'October', 
          label: 'October', 
          emoji: '🎃', 
          season: 'Autumn', 
          hotDestinations: ['India', 'Southeast Asia', 'South America'],
          weatherNote: 'Great weather in Asia',
          festivalCount: 67
        },
        { 
          id: 'November', 
          label: 'November', 
          emoji: '🍁', 
          season: 'Autumn', 
          hotDestinations: ['India', 'Southeast Asia', 'Australia'],
          weatherNote: 'Cool season begins',
          festivalCount: 58
        },
        { 
          id: 'December', 
          label: 'December', 
          emoji: '🎄', 
          season: 'Winter', 
          hotDestinations: ['Australia', 'South America', 'India'],
          weatherNote: 'Summer starts in Southern Hemisphere',
          festivalCount: 73
        }
      ]
    },
    {
      id: 'regions',
      title: 'Where do you want to explore?',
      subtitle: 'Each region offers unique festival cultures and experiences',
      type: 'region',
      icon: '🌍',
      data: [
        { 
          id: 'Western-Europe', 
          label: 'Western Europe', 
          emoji: '🏰', 
          countries: ['UK', 'Germany', 'France', 'Netherlands', 'Belgium', 'Switzerland'],
          description: 'Historic venues, world-class infrastructure, diverse scenes',
          specialties: ['Electronic music heritage', 'Massive outdoor festivals', 'City center events'],
          averageCost: '€€€',
          peakSeason: 'Jun-Aug',
          uniqueFeatures: ['Historic castles as venues', 'Excellent public transport', 'High production values']
        },
        { 
          id: 'Mediterranean', 
          label: 'Mediterranean', 
          emoji: '🌊', 
          countries: ['Spain', 'Italy', 'Greece', 'Portugal', 'Croatia', 'Malta'],
          description: 'Beach festivals, perfect weather, stunning coastal locations',
          specialties: ['Beach parties', 'Sunset performances', 'Island festivals'],
          averageCost: '€€',
          peakSeason: 'May-Sep',
          uniqueFeatures: ['Beach venues', 'Perfect weather', 'Mediterranean cuisine']
        },
        { 
          id: 'Eastern-Europe', 
          label: 'Eastern Europe', 
          emoji: '🏛️', 
          countries: ['Hungary', 'Czech Republic', 'Poland', 'Romania', 'Croatia', 'Serbia'],
          description: 'Emerging scenes, incredible value, authentic experiences',
          specialties: ['Underground culture', 'Budget-friendly', 'Unique venues'],
          averageCost: '€',
          peakSeason: 'Jun-Aug',
          uniqueFeatures: ['Affordable prices', 'Authentic culture', 'Hidden gems']
        },
        { 
          id: 'Scandinavia', 
          label: 'Scandinavia', 
          emoji: '🌲', 
          countries: ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland'],
          description: 'Midnight sun festivals, pristine nature, innovative music',
          specialties: ['24-hour daylight', 'Forest venues', 'Sustainable festivals'],
          averageCost: '€€€€',
          peakSeason: 'Jun-Aug',
          uniqueFeatures: ['Midnight sun', 'Pristine nature', 'Eco-friendly focus']
        },
        { 
          id: 'North-America', 
          label: 'North America', 
          emoji: '🗽', 
          countries: ['USA', 'Canada', 'Mexico'],
          description: 'Massive production, diverse genres, world-class artists',
          specialties: ['Large scale festivals', 'Celebrity lineups', 'Diverse genres'],
          averageCost: '$$$',
          peakSeason: 'Apr-Oct',
          uniqueFeatures: ['Massive scale', 'A-list artists', 'Diverse locations']
        },
        { 
          id: 'South-America', 
          label: 'South America', 
          emoji: '🌴', 
          countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay'],
          description: 'Passionate crowds, vibrant culture, rhythmic music',
          specialties: ['Latin rhythms', 'Carnival culture', 'Beach festivals'],
          averageCost: '$$',
          peakSeason: 'Nov-Mar',
          uniqueFeatures: ['Passionate crowds', 'Cultural diversity', 'Great value']
        },
        { 
          id: 'Asia-Pacific', 
          label: 'Asia Pacific', 
          emoji: '🏯', 
          countries: ['Japan', 'South Korea', 'Thailand', 'Singapore', 'Hong Kong', 'Taiwan'],
          description: 'Cutting-edge technology, unique aesthetics, growing scenes',
          specialties: ['Tech innovation', 'Unique culture', 'Urban festivals'],
          averageCost: '$$$',
          peakSeason: 'Mar-May, Oct-Dec',
          uniqueFeatures: ['High-tech production', 'Unique culture', 'Urban settings']
        },
        { 
          id: 'Australia-Oceania', 
          label: 'Australia & Oceania', 
          emoji: '🦘', 
          countries: ['Australia', 'New Zealand'],
          description: 'Beach festivals, laid-back vibes, stunning natural venues',
          specialties: ['Beach festivals', 'Natural amphitheaters', 'Relaxed atmosphere'],
          averageCost: '$$$',
          peakSeason: 'Dec-Mar',
          uniqueFeatures: ['Beach venues', 'Natural beauty', 'Laid-back culture']
        },
        { 
          id: 'Anywhere', 
          label: 'Open to Anywhere', 
          emoji: '🌍', 
          countries: ['Global'],
          description: 'Ready for any adventure, any destination',
          specialties: ['Maximum opportunities', 'Best matches', 'Global perspective'],
          averageCost: 'Varies',
          peakSeason: 'Year-round',
          uniqueFeatures: ['Best matches', 'Most options', 'Global diversity']
        }
      ]
    },
    {
      id: 'vibes',
      title: 'What\'s your festival vibe?',
      subtitle: 'The atmosphere and energy you\'re seeking',
      type: 'multiVibe',
      icon: '✨',
      data: [
        { 
          id: 'underground', 
          label: 'Underground & Alternative', 
          emoji: '🔥', 
          description: 'Raw, authentic, cutting-edge music and art',
          characteristics: ['Experimental music', 'Artistic freedom', 'Smaller crowds', 'Authentic culture'],
          examples: ['Warehouse parties', 'Art collectives', 'Indie venues']
        },
        { 
          id: 'mainstream', 
          label: 'Mainstream & Commercial', 
          emoji: '🎪', 
          description: 'Popular artists, high production, mass appeal',
          characteristics: ['Chart-topping artists', 'High production', 'Large crowds', 'Professional organization'],
          examples: ['Major festivals', 'Stadium shows', 'Radio hits']
        },
        { 
          id: 'cultural', 
          label: 'Cultural & Arts Focus', 
          emoji: '🎭', 
          description: 'Art installations, cultural exchange, creativity',
          characteristics: ['Art installations', 'Cultural workshops', 'Creative expression', 'Educational'],
          examples: ['Art festivals', 'Cultural celebrations', 'Creative workshops']
        },
        { 
          id: 'bohemian', 
          label: 'Bohemian & Hippie', 
          emoji: '🌸', 
          description: 'Free-spirited, peaceful, natural settings',
          characteristics: ['Peace and love', 'Natural settings', 'Spiritual elements', 'Community focused'],
          examples: ['Forest festivals', 'Spiritual gatherings', 'Eco-festivals']
        },
        { 
          id: 'party', 
          label: 'High-Energy Party', 
          emoji: '🎉', 
          description: 'Non-stop dancing, energetic crowds, party atmosphere',
          characteristics: ['24/7 music', 'Dance floors', 'High energy', 'Party culture'],
          examples: ['Electronic festivals', 'Beach parties', 'Club festivals']
        },
        { 
          id: 'intimate', 
          label: 'Intimate & Boutique', 
          emoji: '🕯️', 
          description: 'Small crowds, personal connection, curated experience',
          characteristics: ['Small capacity', 'Curated lineups', 'Personal experience', 'Exclusive feel'],
          examples: ['Boutique festivals', 'Private events', 'Exclusive venues']
        },
        { 
          id: 'spiritual', 
          label: 'Spiritual & Mindful', 
          emoji: '🧘', 
          description: 'Meditation, wellness, consciousness expansion',
          characteristics: ['Meditation sessions', 'Wellness activities', 'Spiritual growth', 'Healing arts'],
          examples: ['Wellness festivals', 'Transformational events', 'Spiritual gatherings']
        },
        { 
          id: 'adventure', 
          label: 'Adventure & Outdoors', 
          emoji: '🏔️', 
          description: 'Nature settings, outdoor activities, adventure sports',
          characteristics: ['Natural venues', 'Outdoor activities', 'Adventure sports', 'Nature connection'],
          examples: ['Mountain festivals', 'Desert events', 'Adventure races']
        }
      ]
    },
    {
      id: 'experience',
      title: 'What type of experience appeals to you?',
      subtitle: 'Duration and intensity of your festival adventure',
      type: 'experience',
      icon: '⏰',
      data: [
        { 
          id: 'single-day', 
          label: 'Single Day Events', 
          emoji: '☀️', 
          description: 'One perfect day of music and fun',
          pros: ['Easy to plan', 'Lower cost', 'No accommodation needed', 'Try new festivals'],
          cons: ['Limited experience', 'Rushed feeling'],
          ideal: 'First-time festival goers, busy schedules, local events'
        },
        { 
          id: 'weekend', 
          label: 'Weekend Warriors', 
          emoji: '🎯', 
          description: '2-3 days of intensive festival experience',
          pros: ['Perfect balance', 'Manageable time off', 'Full experience', 'Recovery time'],
          cons: ['Can feel rushed', 'Limited rest'],
          ideal: 'Most popular choice, work-life balance, maximum fun'
        },
        { 
          id: 'extended', 
          label: 'Extended Adventures', 
          emoji: '🌟', 
          description: '4-7 days of total immersion',
          pros: ['Full immersion', 'Meet more people', 'Explore destination', 'Relaxed pace'],
          cons: ['More expensive', 'Time off work', 'Can be tiring'],
          ideal: 'Vacation time, international travel, deep experiences'
        },
        { 
          id: 'flexible', 
          label: 'Flexible & Open', 
          emoji: '🌀', 
          description: 'Duration depends on the perfect festival match',
          pros: ['Best opportunities', 'Match-based decisions', 'Optimal experiences'],
          cons: ['Requires flexibility'],
          ideal: 'Open minded, best matches, spontaneous travelers'
        }
      ]
    },
    {
      id: 'social',
      title: 'How do you like to festival?',
      subtitle: 'Your social style and crowd preferences',
      type: 'social',
      icon: '👥',
      data: [
        { 
          id: 'solo-adventure', 
          label: 'Solo Adventure', 
          emoji: '🚶', 
          description: 'Independent exploration and meeting new people',
          benefits: ['Complete freedom', 'Meet locals', 'Personal growth', 'Go at your pace'],
          tips: ['Choose safe destinations', 'Stay in social accommodations', 'Join group activities']
        },
        { 
          id: 'couple-romantic', 
          label: 'Romantic Couple', 
          emoji: '💕', 
          description: 'Intimate experiences shared with your partner',
          benefits: ['Shared memories', 'Romantic settings', 'Quality time', 'Photo opportunities'],
          tips: ['Book romantic accommodations', 'Plan couple activities', 'Sunset viewing spots']
        },
        { 
          id: 'friends-group', 
          label: 'Friends Group', 
          emoji: '👯', 
          description: 'Fun with your squad and collective experiences',
          benefits: ['Shared costs', 'Group energy', 'Safety in numbers', 'Shared memories'],
          tips: ['Book group accommodations', 'Plan meeting points', 'Assign group roles']
        },
        { 
          id: 'family-friendly', 
          label: 'Family Adventure', 
          emoji: '👨‍👩‍👧‍👦', 
          description: 'All-ages fun with family-friendly activities',
          benefits: ['Family bonding', 'All-ages entertainment', 'Educational value', 'Safe environment'],
          tips: ['Check age restrictions', 'Plan rest breaks', 'Bring ear protection']
        },
        { 
          id: 'social-butterfly', 
          label: 'Social Butterfly', 
          emoji: '🦋', 
          description: 'Love meeting new people and networking',
          benefits: ['Expand network', 'Cultural exchange', 'New friendships', 'Diverse perspectives'],
          tips: ['Join festival communities', 'Attend workshops', 'Use festival apps']
        }
      ]
    },
    {
      id: 'priorities',
      title: 'What matters most to you?',
      subtitle: 'Rank your festival priorities to get perfect matches',
      type: 'priorities',
      icon: '🎯',
      data: [
        { 
          id: 'music-quality', 
          label: 'Music Quality & Artists', 
          emoji: '🎵', 
          description: 'Top-tier artists and music curation',
          weight: 'high'
        },
        { 
          id: 'value-money', 
          label: 'Value for Money', 
          emoji: '💰', 
          description: 'Getting the most for your budget',
          weight: 'high'
        },
        { 
          id: 'location-beauty', 
          label: 'Location & Scenery', 
          emoji: '🏞️', 
          description: 'Beautiful and Instagram-worthy venues',
          weight: 'medium'
        },
        { 
          id: 'crowd-vibe', 
          label: 'Crowd & Atmosphere', 
          emoji: '✨', 
          description: 'The right people and energy',
          weight: 'high'
        },
        { 
          id: 'facilities-comfort', 
          label: 'Facilities & Comfort', 
          emoji: '🏨', 
          description: 'Good infrastructure and amenities',
          weight: 'medium'
        },
        { 
          id: 'adventure-uniqueness', 
          label: 'Adventure & Uniqueness', 
          emoji: '🌟', 
          description: 'Once-in-a-lifetime experiences',
          weight: 'medium'
        }
      ]
    }
  ];

  const currentStep = quizSteps[state.currentStep];

  // LEGENDARY ANIMATIONS
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    duration: 0.5
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  // HANDLERS
  const handleMultiSelect = (field: string, optionId: string) => {
    const currentValues = (state.answers as any)[field] || [];
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter((id: string) => id !== optionId)
      : [...currentValues, optionId];
    (setAnswer as any)(field, newValues);
  };

  const handleSingleSelect = (field: string, value: any) => {
    (setAnswer as any)(field, value);
  };

  const isSelected = (field: string, optionId: string) => {
    const values = (state.answers as any)[field] || [];
    return values.includes(optionId);
  };

  const canProceed = () => {
    const currentAnswers = (state.answers as any)[currentStep.id];
    if (!currentAnswers) return false;
    
    if (Array.isArray(currentAnswers)) {
      return currentAnswers.length > 0;
    }
    return !!currentAnswers;
  };

  const handleNext = () => {
    if (state.currentStep < quizSteps.length - 1) {
      nextStep();
    } else {
      completeQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* LEGENDARY PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {currentStep.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Step {state.currentStep + 1} of {quizSteps.length}
                </h3>
                <p className="text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Time spent</div>
              <div className="font-semibold text-purple-600">
                {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
            >
              {/* QUESTION HEADER */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  {currentStep.icon}
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentStep.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* DYNAMIC CONTENT BASED ON STEP TYPE */}
              {renderStepContent(currentStep, state, handleMultiSelect, handleSingleSelect, isSelected)}

              {/* NAVIGATION */}
              <div className="flex justify-between items-center mt-12">
                <motion.button
                  onClick={prevStep}
                  disabled={state.currentStep === 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    state.currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-lg'
                  }`}
                >
                  ← Previous
                </motion.button>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {canProceed() ? '✅ Ready to continue' : '⏳ Select at least one option'}
                  </div>
                  {!canProceed() && currentStep.type.startsWith('multi') && (
                    <div className="text-xs text-purple-600">
                      💡 Multiple selections improve match accuracy
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  whileHover={canProceed() ? { scale: 1.05 } : {}}
                  whileTap={canProceed() ? { scale: 0.95 } : {}}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {state.currentStep === quizSteps.length - 1 ? 'Get My Matches! 🎉' : 'Next →'}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// LEGENDARY CONTENT RENDERER
function renderStepContent(step: any, state: any, handleMultiSelect: any, handleSingleSelect: any, isSelected: any) {
  const { type, data } = step;

  switch (type) {
    case 'multiGenre':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((genre: any, index: number) => (
            <motion.div
              key={genre.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMultiSelect('genres', genre.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected('genres', genre.id)
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500 shadow-2xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{genre.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{genre.label}</h3>
              <div className="text-sm opacity-90 mb-3">
                {genre.subgenres.slice(0, 3).join(' • ')}
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isSelected('genres', genre.id) 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {genre.mood}
                </div>
                <div className="text-xs opacity-75">
                  {genre.popularity}% popular
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'budget':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((budget: any, index: number) => (
            <motion.div
              key={budget.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSingleSelect('budget', budget.range)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                state.answers.budget?.min === budget.range.min && state.answers.budget?.max === budget.range.max
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-500 shadow-2xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{budget.emoji}</div>
              <h3 className="font-bold text-xl mb-2">{budget.label}</h3>
              <div className="text-lg font-semibold mb-3">
                {budget.currencies.USD}
              </div>
              <p className="text-sm opacity-90 mb-4">{budget.description}</p>
              <div className="space-y-1">
                {budget.tips.slice(0, 2).map((tip: string, idx: number) => (
                  <div key={idx} className="text-xs opacity-80">
                    💡 {tip}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'multiMonth':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((month: any, index: number) => (
            <motion.div
              key={month.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.05 }}
              onClick={() => handleMultiSelect('months', month.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 text-center ${
                isSelected('months', month.id)
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-500 shadow-xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <div className="text-3xl mb-2">{month.emoji}</div>
              <h3 className="font-bold mb-1">{month.label}</h3>
              <div className="text-xs opacity-80 mb-2">{month.season}</div>
              <div className="text-xs font-medium">
                {month.festivalCount} festivals
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'region':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((region: any, index: number) => (
            <motion.div
              key={region.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSingleSelect('region', region.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                state.answers.region === region.id
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-indigo-500 shadow-2xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{region.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{region.label}</h3>
              <p className="text-sm opacity-90 mb-3">{region.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  state.answers.region === region.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {region.averageCost}
                </span>
                <span className="opacity-75">{region.peakSeason}</span>
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'multiVibe':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((vibe: any, index: number) => (
            <motion.div
              key={vibe.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMultiSelect('vibes', vibe.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected('vibes', vibe.id)
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white border-pink-500 shadow-2xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{vibe.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{vibe.label}</h3>
              <p className="text-sm opacity-90 mb-3">{vibe.description}</p>
              <div className="space-y-1">
                {vibe.characteristics.slice(0, 2).map((char: string, idx: number) => (
                  <div key={idx} className="text-xs opacity-80">
                    • {char}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      );

    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSingleSelect(step.id, item.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                state.answers[step.id] === item.id
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500 shadow-2xl'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{item.label}</h3>
              <p className="text-sm opacity-90">{item.description}</p>
            </motion.div>
          ))}
        </div>
      );
  }
}
