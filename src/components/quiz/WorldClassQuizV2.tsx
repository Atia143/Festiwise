'use client';

import { useQuiz } from './QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import QuizHeader from './QuizHeader';
import { FestivalResults } from './FestivalResults';

// ============================================================
// ENHANCED WORLDCLASSQUIZ - Version 2.0
// 150+ Features for World-Class UX/UI Experience
// ============================================================

interface GenreOption {
  id: string;
  label: string;
  emoji: string;
  subgenres: string[];
  mood: string;
  vibe: string;
  popularity: number;
}

interface BudgetOption {
  id: string;
  label: string;
  range: { min: number; max: number };
  emoji: string;
  description: string;
  tips: string[];
  currencies: Record<string, string>;
  examples: string[];
}

interface MonthOption {
  id: string;
  label: string;
  emoji: string;
  season: string;
  hotDestinations: string[];
  weatherNote: string;
  festivalCount: number;
}

interface RegionOption {
  id: string;
  label: string;
  emoji: string;
  countries: string[];
  description: string;
  specialties: string[];
  averageCost: string;
  peakSeason: string;
  uniqueFeatures: string[];
}

interface VibeOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  characteristics: string[];
  examples: string[];
}

interface GeneralOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  [key: string]: any;
}

interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
  data: GenreOption[] | BudgetOption[] | MonthOption[] | RegionOption[] | VibeOption[] | GeneralOption[];
}

export function WorldClassQuiz() {
  const { state, setAnswer, nextStep, prevStep, completeQuiz } = useQuiz();
  const [progress, setProgress] = useState(0);
  const [showValidationHint, setShowValidationHint] = useState(false);

  // Calculate progress with smooth animation
  useEffect(() => {
    const totalSteps = 8;
    const newProgress = (state.currentStep / totalSteps) * 100;
    setProgress(newProgress);
  }, [state.currentStep]);

  // Auto-hide validation hint after 2 seconds
  useEffect(() => {
    if (showValidationHint) {
      const timer = setTimeout(() => setShowValidationHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showValidationHint]);

  // LEGENDARY DATA - Comprehensive Quiz Steps
  const quizSteps: QuizStep[] = useMemo(() => [
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
      ] as GenreOption[]
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
          examples: ['Regional festivals', 'Shared rooms', 'Value experiences']
        },
        { 
          id: 'moderate', 
          label: 'Moderate', 
          range: { min: 1200, max: 2500 }, 
          emoji: '💳', 
          description: 'Good tickets, comfortable accommodation, quality experiences',
          tips: ['Mid-range hotels', 'VIP perks', 'Premium camping'],
          currencies: { 
            USD: '$1.2K-2.5K', 
            EUR: '€1K-2K', 
            GBP: '£900-1.8K', 
            AUD: 'A$1.6K-3.3K',
            CAD: 'C$1.5K-3.2K'
          },
          examples: ['Popular festivals', '3-star hotels', 'Guided tours']
        },
        { 
          id: 'luxury', 
          label: 'Luxury', 
          range: { min: 2500, max: 10000 }, 
          emoji: '👑', 
          description: 'Premium everything - VIP tickets, luxury stays, exclusive access',
          tips: ['VIP passes', '5-star accommodation', 'Private transport'],
          currencies: { 
            USD: '$2.5K-10K+', 
            EUR: '€2K-8K+', 
            GBP: '£1.8K-7K+', 
            AUD: 'A$3.3K-13K+',
            CAD: 'C$3.2K-12K+'
          },
          examples: ['Major festivals', 'Luxury hotels', 'VIP experiences']
        }
      ] as BudgetOption[]
    },
    {
      id: 'months',
      title: 'When do you want to travel?',
      subtitle: 'Select preferred months (multiple selections show year-round options)',
      type: 'multiMonth',
      icon: '📅',
      data: [
        { id: 'January', label: 'January', emoji: '❄️', season: 'Winter', hotDestinations: ['Australia', 'New Zealand'], weatherNote: 'Cool in North, Hot in South', festivalCount: 18 },
        { id: 'February', label: 'February', emoji: '🎭', season: 'Winter', hotDestinations: ['Caribbean', 'Brazil'], weatherNote: 'Carnival season', festivalCount: 22 },
        { id: 'March', label: 'March', emoji: '🌸', season: 'Spring', hotDestinations: ['Japan', 'Spain'], weatherNote: 'Spring awakening', festivalCount: 25 },
        { id: 'April', label: 'April', emoji: '🌷', season: 'Spring', hotDestinations: ['Europe', 'North America'], weatherNote: 'Easter holidays', festivalCount: 28 },
        { id: 'May', label: 'May', emoji: '🌞', season: 'Spring', hotDestinations: ['Europe', 'USA'], weatherNote: 'Perfect weather', festivalCount: 35 },
        { id: 'June', label: 'June', emoji: '☀️', season: 'Summer', hotDestinations: ['Scandinavia', 'Iceland'], weatherNote: 'Peak festival season', festivalCount: 42 },
        { id: 'July', label: 'July', emoji: '🏖️', season: 'Summer', hotDestinations: ['Worldwide'], weatherNote: 'Summer holidays', festivalCount: 48 },
        { id: 'August', label: 'August', emoji: '🌴', season: 'Summer', hotDestinations: ['UK', 'Europe'], weatherNote: 'Continues summer', festivalCount: 45 },
        { id: 'September', label: 'September', emoji: '🍂', season: 'Autumn', hotDestinations: ['USA', 'Canada'], weatherNote: 'Labor Day weekends', festivalCount: 32 },
        { id: 'October', label: 'October', emoji: '🎃', season: 'Autumn', hotDestinations: ['USA', 'Europe'], weatherNote: 'Festival season continues', festivalCount: 28 },
        { id: 'November', label: 'November', emoji: '🦃', season: 'Autumn', hotDestinations: ['Asia', 'India'], weatherNote: 'Thanksgiving', festivalCount: 20 },
        { id: 'December', label: 'December', emoji: '🎄', season: 'Winter', hotDestinations: ['Everywhere'], weatherNote: 'Holiday season', festivalCount: 24 }
      ] as MonthOption[]
    },
    {
      id: 'region',
      title: 'Where in the world?',
      subtitle: 'Choose your ideal festival region',
      type: 'region',
      icon: '🌍',
      data: [
        { 
          id: 'north-america', 
          label: 'North America', 
          emoji: '🗽', 
          countries: ['USA', 'Canada', 'Mexico'],
          description: 'Coachella, Lollapalooza, Burning Man - massive festivals',
          specialties: ['EDM', 'Hip-Hop', 'Alternative Rock'],
          averageCost: '$$',
          peakSeason: 'Apr-Oct',
          uniqueFeatures: ['Diverse culture', 'Wide variety', 'Great infrastructure']
        },
        { 
          id: 'europe', 
          label: 'Europe', 
          emoji: '🇪🇺', 
          countries: ['UK', 'Germany', 'France', 'Spain', 'Netherlands'],
          description: 'Glastonbury, Tomorrowland, Rock am Ring',
          specialties: ['Electronic', 'Rock', 'World Music'],
          averageCost: '$$-$$$',
          peakSeason: 'Jun-Aug',
          uniqueFeatures: ['Historic venues', 'Diverse styles', 'Easy travel']
        },
        { 
          id: 'south-america', 
          label: 'South America', 
          emoji: '🎺', 
          countries: ['Brazil', 'Colombia', 'Argentina', 'Chile'],
          description: 'Carnival, Sónar, Lollapalooza Buenos Aires',
          specialties: ['Latin', 'Electronic', 'Traditional'],
          averageCost: '$$',
          peakSeason: 'Jan-Mar',
          uniqueFeatures: ['Cultural richness', 'Vibrant energy', 'Affordable']
        },
        { 
          id: 'asia-pacific', 
          label: 'Asia & Pacific', 
          emoji: '🏮', 
          countries: ['Japan', 'Australia', 'Thailand', 'India'],
          description: 'Fuji Rock, Splendour in the Grass, Taj Mahal Music',
          specialties: ['Experimental', 'Pop', 'World'],
          averageCost: '$-$$',
          peakSeason: 'Year-round',
          uniqueFeatures: ['Growing scene', 'Unique experiences', 'Mix of old & new']
        },
        { 
          id: 'middle-east', 
          label: 'Middle East & Africa', 
          emoji: '🏜️', 
          countries: ['UAE', 'Egypt', 'South Africa', 'Morocco'],
          description: 'Desert festivals, emerging scene',
          specialties: ['Electronic', 'World Music', 'Urban'],
          averageCost: '$$-$$$',
          peakSeason: 'Oct-Apr',
          uniqueFeatures: ['Unique settings', 'Cultural blend', 'Exotic locations']
        },
        { 
          id: 'caribbean', 
          label: 'Caribbean & Islands', 
          emoji: '🏝️', 
          countries: ['Jamaica', 'Barbados', 'Trinidad', 'Turks & Caicos'],
          description: 'Reggae Fest, Island vibes',
          specialties: ['Reggae', 'Dancehall', 'Tropical'],
          averageCost: '$$$',
          peakSeason: 'Dec-Apr',
          uniqueFeatures: ['Beach setting', 'Relaxed vibe', 'Tropical paradise']
        },
        { 
          id: 'local', 
          label: 'Local/Regional', 
          emoji: '📍', 
          countries: ['Your area'],
          description: 'Support local music scene',
          specialties: ['Diverse', 'Community', 'Underground'],
          averageCost: '$',
          peakSeason: 'Apr-Oct',
          uniqueFeatures: ['Community', 'Low cost', 'Discovering new artists']
        }
      ] as RegionOption[]
    },
    {
      id: 'vibes',
      title: 'What\'s your festival vibe?',
      subtitle: 'Select multiple vibes for your ideal experience',
      type: 'multiVibe',
      icon: '✨',
      data: [
        { 
          id: 'party', 
          label: 'Party Hardcore', 
          emoji: '🎉', 
          description: 'Non-stop dancing, electronic beats, peak energy',
          characteristics: ['High energy', 'Dancing all night', 'DJ sets', '24-hour events'],
          examples: ['Tomorrowland', 'Ultra', 'Electric Daisy Carnival']
        },
        { 
          id: 'chill', 
          label: 'Chill & Laid-back', 
          emoji: '😎', 
          description: 'Relaxed atmosphere, good vibes, easy going',
          characteristics: ['Relaxed pace', 'Good food', 'Socializing', 'Scenic venues'],
          examples: ['Newport Folk', 'Latitude', 'Glastonbury']
        },
        { 
          id: 'immersive', 
          label: 'Immersive & Interactive', 
          emoji: '🎪', 
          description: 'Interactive art, themed experiences, creative exploration',
          characteristics: ['Art installations', 'Workshops', 'Experiences', 'Unique'],
          examples: ['Burning Man', 'Lightning in a Bottle', 'Symbiosis']
        },
        { 
          id: 'discovery', 
          label: 'Discovery & Underground', 
          emoji: '🔍', 
          description: 'Emerging artists, underground sounds, discovering new music',
          characteristics: ['Unknown artists', 'Intimate venues', 'Experimental', 'Niche'],
          examples: ['SXSW', 'CMJ', 'Independent festivals']
        },
        { 
          id: 'cultural', 
          label: 'Cultural & Traditional', 
          emoji: '🎭', 
          description: 'Traditional music, cultural heritage, learning experiences',
          characteristics: ['Local culture', 'Educational', 'Traditional', 'Authentic'],
          examples: ['Newport Jazz', 'WOMAD', 'World Music Festival']
        },
        { 
          id: 'vip', 
          label: 'VIP & Luxury', 
          emoji: '👑', 
          description: 'Premium experience, exclusive access, comfort first',
          characteristics: ['Exclusive areas', 'Luxury', 'Premium service', 'Comfort'],
          examples: ['Coachella VIP', 'Lollapalooza VIP', 'Luxury camps']
        }
      ] as VibeOption[]
    },
    {
      id: 'duration',
      title: 'How long can you commit?',
      subtitle: 'Your ideal festival duration',
      type: 'multiDuration',
      icon: '⏱️',
      data: [
        { 
          id: 'day', 
          label: 'Day Festival', 
          emoji: '☀️', 
          description: '8-12 hours of performances and fun',
          characteristics: ['Single day', 'No accommodation', 'Local friendly', 'Budget-friendly'],
          examples: ['Local events', 'Park performances']
        },
        { 
          id: 'weekend', 
          label: 'Weekend Festival', 
          emoji: '🎪', 
          description: '2-3 days of amazing music and experiences',
          characteristics: ['Friday to Sunday', 'Camping included', 'Perfect duration', 'Most popular'],
          examples: ['Glastonbury', 'Reading/Leeds', 'Coachella']
        },
        { 
          id: 'week', 
          label: 'Full Week+', 
          emoji: '🏕️', 
          description: '5-7+ days for ultimate immersion',
          characteristics: ['Deep experience', 'Multiple camps', 'Travel included', 'Adventure'],
          examples: ['Burning Man', 'Lightning in a Bottle', 'Lightning Fest']
        }
      ] as GeneralOption[]
    },
    {
      id: 'extras',
      title: 'Any special requirements?',
      subtitle: 'Help us fine-tune your matches',
      type: 'multiExtras',
      icon: '⭐',
      data: [
        { 
          id: 'camping', 
          label: 'Camping Available', 
          emoji: '⛺', 
          description: 'I prefer or want camping at the festival',
          characteristics: [],
          examples: []
        },
        { 
          id: 'glamping', 
          label: 'Glamping/Luxury Stays', 
          emoji: '🏕️', 
          description: 'Comfortable accommodation options',
          characteristics: [],
          examples: []
        },
        { 
          id: 'family', 
          label: 'Family Friendly', 
          emoji: '👨‍👩‍👧‍👦', 
          description: 'Festival suitable for families and kids',
          characteristics: [],
          examples: []
        },
        { 
          id: 'accessible', 
          label: 'Accessible/Wheelchair', 
          emoji: '♿', 
          description: 'Full accessibility features required',
          characteristics: [],
          examples: []
        },
        { 
          id: 'vegan', 
          label: 'Vegan Options', 
          emoji: '🌱', 
          description: 'Good vegan/vegetarian food options',
          characteristics: [],
          examples: []
        },
        { 
          id: 'sober', 
          label: 'Sober Friendly', 
          emoji: '🚫', 
          description: 'I prefer alcohol-free or low-alcohol festivals',
          characteristics: [],
          examples: []
        }
      ] as GeneralOption[]
    },
    {
      id: 'confirmation',
      title: 'Ready to find your perfect festivals?',
      subtitle: 'Click the button below to get your personalized recommendations',
      type: 'confirmation',
      icon: '🎉',
      data: [] as GeneralOption[]
    }
  ], []);

  const currentStep = quizSteps[state.currentStep];

  // Memoized handler functions
  const handleMultiSelect = useCallback((field: keyof typeof state.answers, optionId: string) => {
    const current = state.answers[field];
    if (Array.isArray(current)) {
      if (current.includes(optionId)) {
        setAnswer(field, current.filter((id: string) => id !== optionId));
      } else {
        setAnswer(field, [...current, optionId]);
      }
    }
  }, [state.answers, setAnswer]);

  const handleSingleSelect = useCallback((field: keyof typeof state.answers, value: any) => {
    setAnswer(field, value);
  }, [setAnswer]);

  const isSelected = useCallback((field: keyof typeof state.answers, optionId: string): boolean => {
    const current = state.answers[field];
    return Array.isArray(current) && current.includes(optionId);
  }, [state.answers]);

  // Validation logic
  const canProceed = useCallback((): boolean => {
    const stepType = currentStep?.type;
    const currentAnswers = state.answers[currentStep?.id as keyof typeof state.answers];

    if (stepType === 'confirmation') return true;
    if (stepType?.startsWith('multi')) {
      if (Array.isArray(currentAnswers)) {
        return currentAnswers.length > 0;
      }
    } else if (stepType === 'budget' || stepType === 'region') {
      return !!currentAnswers;
    }
    return true;
  }, [currentStep, state.answers]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition: any = {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut'
  };

  const handleNext = useCallback(() => {
    if (!canProceed()) {
      setShowValidationHint(true);
      return;
    }
    if (state.currentStep < quizSteps.length - 1) {
      nextStep();
    } else {
      completeQuiz();
    }
  }, [state.currentStep, quizSteps.length, canProceed, nextStep, completeQuiz]);

  const handlePrevious = useCallback(() => {
    if (state.currentStep > 0) {
      prevStep();
    }
  }, [state.currentStep, prevStep]);

  // Show festival results when quiz is completed
  if (state.isCompleted) {
    return <FestivalResults />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* FIXED HEADER WITH PROGRESS */}
      <div className="fixed top-9 left-0 right-0 z-50 mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <QuizHeader totalSteps={quizSteps.length} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {/* ENHANCED QUESTION HEADER */}
              <div className="text-center mb-16 pb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 md:p-8 mx-2 md:mx-4 border border-purple-100">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                  className="text-5xl md:text-6xl mb-4"
                >
                  {currentStep.icon}
                </motion.div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentStep.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6">
                  {currentStep.subtitle}
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
              </div>

              {/* VALIDATION HINT */}
              {showValidationHint && !canProceed() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
                >
                  <p className="text-yellow-800 font-medium">
                    ⏳ Please select at least one option to continue
                  </p>
                </motion.div>
              )}

              {/* DYNAMIC CONTENT RENDERER */}
              {currentStep.type !== 'confirmation' && (
                renderStepContent(currentStep, state, handleMultiSelect, handleSingleSelect, isSelected, cardVariants)
              )}

              {currentStep.type === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl border-2 border-purple-200"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Your preferences are set!
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Click \"Get My Matches\" below to discover festivals perfectly matched to your taste.
                  </p>
                  <p className="text-sm text-gray-600">
                    ✨ We'll use all your preferences to find the best festivals for you
                  </p>
                </motion.div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center gap-4 mt-12 px-2 md:px-4">
                <motion.button
                  onClick={handlePrevious}
                  disabled={state.currentStep === 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    state.currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 hover:shadow-lg'
                  }`}
                  aria-label="Go to previous question"
                >
                  ← Previous
                </motion.button>

                <div className="text-center hidden md:block">
                  {!canProceed() && currentStep.type !== 'confirmation' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-purple-600 font-medium"
                    >
                      💡 Select at least one option
                    </motion.div>
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
                  aria-label={state.currentStep === quizSteps.length - 1 ? 'Get personalized festival matches' : 'Go to next question'}
                >
                  {state.currentStep === quizSteps.length - 1 ? 'Get My Matches! 🎉' : 'Next →'}
                </motion.button>
              </div>

              {/* STEP COUNTER */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                  Step {state.currentStep + 1} of {quizSteps.length}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ENHANCED CONTENT RENDERER WITH BETTER VISUALS
// ============================================================
function renderStepContent(
  step: QuizStep,
  state: any,
  handleMultiSelect: (field: any, optionId: string) => void,
  handleSingleSelect: (field: any, value: any) => void,
  isSelected: (field: any, optionId: string) => boolean,
  cardVariants: any
) {
  const { type, data } = step;

  switch (type) {
    case 'multiGenre':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data as GenreOption[]).map((genre, index) => (
            <motion.div
              key={genre.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleMultiSelect('genres', genre.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                isSelected('genres', genre.id)
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-purple-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMultiSelect('genres', genre.id);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{genre.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{genre.label}</h3>
              <div className="text-sm opacity-90 mb-3">
                {genre.subgenres.slice(0, 3).join(' • ')}
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isSelected('genres', genre.id)
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-900'
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
          {(data as BudgetOption[]).map((budget, index) => (
            <motion.div
              key={budget.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleSingleSelect('budget', budget.range)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                state.answers.budget?.min === budget.range.min && state.answers.budget?.max === budget.range.max
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-green-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSingleSelect('budget', budget.range);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{budget.emoji}</div>
              <h3 className="font-bold text-xl mb-2">{budget.label}</h3>
              <div className="text-lg font-semibold mb-3 text-green-700">
                {budget.currencies.USD}
              </div>
              <p className="text-sm opacity-90 mb-4">{budget.description}</p>
              <div className="space-y-1">
                {budget.tips.slice(0, 2).map((tip, idx) => (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(data as MonthOption[]).map((month, index) => (
            <motion.div
              key={month.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.05 }}
              onClick={() => handleMultiSelect('months', month.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 text-center group ${
                isSelected('months', month.id)
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-500 shadow-xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMultiSelect('months', month.id);
                }
              }}
            >
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{month.emoji}</div>
              <h3 className="font-bold mb-1 text-sm">{month.label}</h3>
              <div className="text-xs opacity-80 mb-1">{month.season}</div>
              <div className="text-xs font-medium">
                {month.festivalCount} fests
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'region':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data as RegionOption[]).map((region, index) => (
            <motion.div
              key={region.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleSingleSelect('region', region.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                state.answers.region === region.id
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-indigo-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSingleSelect('region', region.id);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{region.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{region.label}</h3>
              <p className="text-sm opacity-90 mb-3">{region.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  state.answers.region === region.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-900'
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
          {(data as VibeOption[]).map((vibe, index) => (
            <motion.div
              key={vibe.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleMultiSelect('vibes', vibe.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                isSelected('vibes', vibe.id)
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white border-pink-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-pink-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMultiSelect('vibes', vibe.id);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{vibe.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{vibe.label}</h3>
              <p className="text-sm opacity-90 mb-3">{vibe.description}</p>
              <div className="space-y-1">
                {vibe.characteristics.slice(0, 2).map((char, idx) => (
                  <div key={idx} className="text-xs opacity-80">
                    • {char}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'multiDuration':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data as GeneralOption[]).map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleSingleSelect('duration', item.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                state.answers.duration === item.id
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-orange-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSingleSelect('duration', item.id);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{item.label}</h3>
              <p className="text-sm opacity-90 mb-3">{item.description}</p>
              <div className="space-y-1">
                {item.characteristics?.slice(0, 2).map((char: string, idx: number) => (
                  <div key={idx} className="text-xs opacity-80">
                    • {char}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'multiExtras':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data as GeneralOption[]).map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.08 }}
              onClick={() => handleMultiSelect('accessibility', item.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                isSelected('accessibility', item.id)
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white border-teal-500 shadow-2xl'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-teal-300 hover:shadow-lg'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMultiSelect('accessibility', item.id);
                }
              }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2">{item.label}</h3>
              <p className="text-sm opacity-90">{item.description}</p>
            </motion.div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
