'use client';

import { useQuiz } from './QuizContext';
import { FestivalResults } from './FestivalResults';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PremiumLoadingScreen, useSmartLoading } from '../LoadingStates/ProgressiveLoader';
import { QuizStepSkeleton } from '../LoadingStates/SkeletonComponents';

// Mid-Quiz Newsletter Form Component
function MidQuizNewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33',
          email: email,
          subject: '🎪 Quiz Progress Save Request - Festival Finder',
          message: `User requested to save quiz progress and receive weekly festival picks.
          
Email: ${email}
Source: Mid-Quiz Abandonment Prevention CTA (Step 3)
Timestamp: ${new Date().toLocaleString()}
          
This user was engaged enough to reach step 3 of the quiz and wants to save their progress.`,
          from_name: 'Festival Finder Quiz',
          to_name: 'Festival Finder Team'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-sm mx-auto bg-white/15 backdrop-blur rounded-2xl p-4">
        <div className="text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-sm mb-2">Progress Saved!</div>
          <div className="text-xs text-white/80">
            We'll email your results when you finish + send weekly festival picks
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white/15 backdrop-blur rounded-2xl p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Save my results..."
          className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 text-sm focus:outline-none focus:border-white/60"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="px-4 py-2 bg-white text-orange-600 font-bold rounded-lg text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Save!'}
        </button>
      </form>
      {error && (
        <p className="text-xs text-red-200 mt-2 text-center">{error}</p>
      )}
      <p className="text-xs text-white/70 mt-2">
        💌 Get personalized picks weekly. No spam, ever.
      </p>
    </div>
  );
}

interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  description?: string;
  subtext?: string;
  premium?: boolean;
  popularity?: number;
  value?: any;
}

interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'single' | 'multi' | 'slider' | 'scale' | 'grid';
  icon: string;
  required: boolean;
  options?: QuizOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

function QuizContent() {
  const { state, nextStep, prevStep, setAnswer, completeQuiz, resetQuiz } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [sliderValue, setSliderValue] = useState(0);
  
  // World-class loading experience
  const { isLoading: isInitialLoading, finishLoading } = useSmartLoading(1200, 'quiz');
  const [showQuizContent, setShowQuizContent] = useState(false);

  // Premium initialization effect
  useEffect(() => {
    if (!isInitialLoading) {
      const timer = setTimeout(() => setShowQuizContent(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoading]);

  // Timer for analytics and engagement
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset step timer on step change
  useEffect(() => {
    setStepStartTime(Date.now());
    setSliderValue(0);
  }, [state.currentStep]);

  // WORLD-CLASS QUIZ STRUCTURE - Industry Leading Design
  const quizSteps: QuizStep[] = [
    {
      id: 'genres',
      title: 'What music ignites your soul?',
      subtitle: 'Select all genres that make you feel alive',
      description: 'Choose multiple genres for more personalized recommendations',
      type: 'multi',
      icon: '🎵',
      required: true,
      options: [
        { id: 'electronic', label: 'Electronic & EDM', emoji: '🎧', description: 'House, Techno, Trance, Dubstep', popularity: 95 },
        { id: 'rock', label: 'Rock & Metal', emoji: '🎸', description: 'Classic Rock, Metal, Punk, Alternative', popularity: 88 },
        { id: 'pop', label: 'Pop & Mainstream', emoji: '🎤', description: 'Chart hits, Commercial, Dance Pop', popularity: 92 },
        { id: 'hiphop', label: 'Hip-Hop & R&B', emoji: '🎵', description: 'Rap, Trap, Urban, Soul', popularity: 90 },
        { id: 'indie', label: 'Indie & Alternative', emoji: '🎭', description: 'Independent, Art Rock, Experimental', popularity: 75 },
        { id: 'jazz', label: 'Jazz & Blues', emoji: '🎺', description: 'Traditional Jazz, Blues, Funk, Soul', popularity: 65 },
        { id: 'world', label: 'World Music', emoji: '🌍', description: 'Folk, Traditional, Ethnic fusion', popularity: 70 },
        { id: 'classical', label: 'Classical & Orchestra', emoji: '🎼', description: 'Symphony, Chamber, Contemporary', popularity: 55 },
        { id: 'reggae', label: 'Reggae & Caribbean', emoji: '🇯🇲', description: 'Reggae, Dancehall, Ska, Calypso', popularity: 68 },
        { id: 'latin', label: 'Latin & Salsa', emoji: '💃', description: 'Salsa, Bachata, Reggaeton, Brazilian', popularity: 78 },
        { id: 'ambient', label: 'Ambient & Chill', emoji: '🧘', description: 'Chillout, Meditation, Atmospheric', popularity: 60 },
        { id: 'country', label: 'Country & Folk', emoji: '🤠', description: 'Country, Bluegrass, Americana', popularity: 72 }
      ]
    },
    {
      id: 'budget',
      title: 'What\'s your festival investment?',
      subtitle: 'Including tickets, travel, food & accommodation',
      description: 'Be honest - this helps us find festivals within your comfort zone',
      type: 'single',
      icon: '💰',
      required: true,
      options: [
        { 
          id: 'budget1', 
          label: 'Budget Explorer', 
          emoji: '🎒', 
          description: 'Local festivals, camping, budget food',
          subtext: '$200 - $800',
          value: { min: 200, max: 800 }
        },
        { 
          id: 'budget2', 
          label: 'Mid-Range Adventurer', 
          emoji: '🏕️', 
          description: 'Regional festivals, mix of camping & hotels',
          subtext: '$800 - $2,500',
          value: { min: 800, max: 2500 }
        },
        { 
          id: 'budget3', 
          label: 'Premium Experience', 
          emoji: '🏨', 
          description: 'Major festivals, comfortable accommodation',
          subtext: '$2,500 - $6,000',
          value: { min: 2500, max: 6000 }
        },
        { 
          id: 'budget4', 
          label: 'Luxury Festival Goer', 
          emoji: '💎', 
          description: 'VIP experiences, luxury stays, private events',
          subtext: '$6,000 - $15,000+',
          value: { min: 6000, max: 15000 },
          premium: true
        }
      ]
    },
    {
      id: 'experience',
      title: 'What\'s your festival experience level?',
      subtitle: 'This helps us recommend the right complexity and size',
      type: 'single',
      icon: '🎪',
      required: true,
      options: [
        { id: 'newbie', label: 'Festival Newbie', emoji: '🌱', description: 'First or second festival experience' },
        { id: 'casual', label: 'Casual Festival Goer', emoji: '🎉', description: '3-10 festivals under your belt' },
        { id: 'enthusiast', label: 'Festival Enthusiast', emoji: '🔥', description: '10+ festivals, you know the drill' },
        { id: 'veteran', label: 'Festival Veteran', emoji: '👑', description: '50+ festivals, you live for this', premium: true }
      ]
    },
    {
      id: 'region',
      title: 'Where\'s your festival playground?',
      subtitle: 'Choose your preferred festival destinations',
      description: 'Select multiple regions if you\'re open to traveling',
      type: 'multi',
      icon: '🌍',
      required: true,
      options: [
        { id: 'western-europe', label: 'Western Europe', emoji: '🇪🇺', description: 'UK, Germany, Netherlands, Belgium, France' },
        { id: 'eastern-europe', label: 'Eastern Europe', emoji: '🏰', description: 'Hungary, Czech Republic, Poland, Croatia' },
        { id: 'north-america', label: 'North America', emoji: '🇺🇸', description: 'USA, Canada, Mexico' },
        { id: 'south-america', label: 'South America', emoji: '🇧🇷', description: 'Brazil, Argentina, Colombia, Chile' },
        { id: 'asia-pacific', label: 'Asia Pacific', emoji: '🇯🇵', description: 'Japan, Australia, Thailand, South Korea' },
        { id: 'africa-middle-east', label: 'Africa & Middle East', emoji: '🇿🇦', description: 'South Africa, UAE, Morocco, Israel' },
        { id: 'anywhere', label: 'Anywhere Amazing!', emoji: '✈️', description: 'I\'m open to festival adventures worldwide' }
      ]
    },
    {
      id: 'vibes',
      title: 'What\'s your perfect festival vibe?',
      subtitle: 'Select all vibes that resonate with your festival soul',
      type: 'multi',
      icon: '✨',
      required: true,
      options: [
        { id: 'mainstream', label: 'Mainstream Magic', emoji: '🔥', description: 'Big names, massive crowds, chart-toppers' },
        { id: 'underground', label: 'Underground Culture', emoji: '🕳️', description: 'Hidden gems, emerging artists, raw authenticity' },
        { id: 'party', label: 'Non-Stop Party', emoji: '🎉', description: 'High energy, dancing till dawn, pure euphoria' },
        { id: 'cultural', label: 'Cultural Journey', emoji: '🎨', description: 'Art installations, workshops, mind expansion' },
        { id: 'spiritual', label: 'Spiritual Connection', emoji: '🧘', description: 'Consciousness, meditation, transformation' },
        { id: 'intimate', label: 'Intimate & Cozy', emoji: '🕯️', description: 'Small crowds, personal connections, acoustic vibes' },
        { id: 'luxury', label: 'Luxury Experience', emoji: '🥂', description: 'VIP treatment, gourmet food, premium comfort' },
        { id: 'adventure', label: 'Adventure Seeking', emoji: '🏔️', description: 'Unique locations, extreme experiences, thrill-seeking' }
      ]
    },
    {
      id: 'months',
      title: 'When can you escape to festival paradise?',
      subtitle: 'Select all months when you\'re free to festival',
      type: 'multi',
      icon: '📅',
      required: true,
      options: [
        { id: 'winter', label: 'Winter Wonderland', emoji: '❄️', description: 'Dec - Feb: Indoor venues, warm destinations' },
        { id: 'spring', label: 'Spring Awakening', emoji: '🌸', description: 'Mar - May: Perfect weather, blooming season' },
        { id: 'early-summer', label: 'Early Summer', emoji: '☀️', description: 'June: Festival season begins, great weather' },
        { id: 'peak-summer', label: 'Peak Summer', emoji: '🔥', description: 'July: Festival peak season, hottest events' },
        { id: 'late-summer', label: 'Late Summer', emoji: '🌻', description: 'August: Still warm, harvest vibes' },
        { id: 'autumn', label: 'Autumn Colors', emoji: '🍂', description: 'Sep - Nov: Cooler weather, cozy atmosphere' },
        { id: 'flexible', label: 'Completely Flexible', emoji: '🗓️', description: 'Any time works - show me everything!' }
      ]
    },
    {
      id: 'priorities',
      title: 'What matters most to you?',
      subtitle: 'Rank these factors by importance (drag to reorder)',
      type: 'scale',
      icon: '⭐',
      required: true,
      options: [
        { id: 'music-quality', label: 'Music Quality & Lineup', emoji: '�', description: 'Top-tier artists and perfect sound' },
        { id: 'value-money', label: 'Value for Money', emoji: '💰', description: 'Getting the most bang for your buck' },
        { id: 'atmosphere', label: 'Festival Atmosphere', emoji: '✨', description: 'Unique vibes and magical experiences' },
        { id: 'location', label: 'Location & Setting', emoji: '�️', description: 'Beautiful venues and scenic backdrops' },
        { id: 'food-drinks', label: 'Food & Drinks', emoji: '🍕', description: 'Amazing culinary experiences' },
        { id: 'accommodation', label: 'Accommodation Quality', emoji: '🏨', description: 'Comfortable places to rest' },
        { id: 'safety-security', label: 'Safety & Security', emoji: '🛡️', description: 'Well-organized and secure events' },
        { id: 'social-scene', label: 'Social Scene', emoji: '👥', description: 'Meeting like-minded festival lovers' }
      ]
    }
  ];

  const currentStepData = quizSteps[state.currentStep];
  const totalSteps = quizSteps.length;
  const progress = ((state.currentStep + 1) / totalSteps) * 100;

  // Initialize selected options from existing answers
  useEffect(() => {
    if (currentStepData) {
      const existingAnswer = state.answers[currentStepData.id as keyof typeof state.answers];
      if (Array.isArray(existingAnswer)) {
        setSelectedOptions(existingAnswer);
      } else if (existingAnswer) {
        setSelectedOptions([existingAnswer as string]);
      } else {
        setSelectedOptions([]);
      }
    }
  }, [state.currentStep, currentStepData, currentStepData?.id]);

  const handleOptionSelect = (optionId: string, optionData: QuizOption) => {
    const stepId = currentStepData.id;
    
    if (currentStepData.type === 'multi') {
      const newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      
      setSelectedOptions(newSelection);
      setAnswer(stepId as keyof typeof state.answers, newSelection);
    } else {
      setSelectedOptions([optionId]);
      
      if (stepId === 'budget') {
        setAnswer('budget', optionData.value);
      } else {
        setAnswer(stepId as keyof typeof state.answers, optionId);
      }
    }

    // Auto-advance for single select after short delay
    if (currentStepData.type === 'single') {
      setTimeout(() => {
        handleNext();
      }, 600);
    }
  };

  const handleNext = async () => {
    setIsTransitioning(true);
    
    // Add slight delay for smooth transitions
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (state.currentStep < totalSteps - 1) {
      nextStep();
    } else {
      completeQuiz();
    }
    
    setIsTransitioning(false);
  };

  const handlePrevious = async () => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    prevStep();
    setIsTransitioning(false);
  };

  const canProceed = () => {
    if (!currentStepData.required) return true;
    
    if (currentStepData.type === 'multi') {
      return selectedOptions.length > 0;
    }
    
    return selectedOptions.length > 0;
  };

  const isSelected = (optionId: string) => {
    return selectedOptions.includes(optionId);
  };

  const getStepIcon = () => {
    const icons = ['🎵', '💰', '🎪', '🌍', '✨', '📅', '⭐'];
    return icons[state.currentStep] || '🎪';
  };

  return (
    <>
      {/* Premium Loading Screen */}
      <PremiumLoadingScreen
        isVisible={isInitialLoading}
        onComplete={finishLoading}
        context="quiz"
      />

      {/* Quiz Content with Smart Loading */}
      <AnimatePresence>
        {showQuizContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          >
            {/* PREMIUM PROGRESS BAR - Mobile Optimized */}
            <div 
              className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm"
              style={{ top: 'calc(var(--banner-height, 0px) + 80px)' }}
            >
              <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-xl md:text-2xl">{getStepIcon()}</div>
                    <div>
                      <h2 className="text-xs md:text-sm font-bold text-gray-800">
                        Step {state.currentStep + 1} of {totalSteps}
                      </h2>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {Math.round((Date.now() - stepStartTime) / 1000)}s on this step
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {timeSpent}s total
                    </div>
                    <button
                      onClick={resetQuiz}
                      className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors touch-manipulation px-2 py-1"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar with Steps - Enhanced Mobile */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 h-full rounded-full shadow-inner"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Step Indicators - Responsive sizing */}
                  <div className="flex justify-between items-center absolute -top-1 left-0 right-0">
                    {quizSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 ${
                          index <= state.currentStep 
                            ? 'bg-purple-600 border-purple-600' 
                            : 'bg-white border-gray-300'
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: index === state.currentStep ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.1 : 1.2) : 1,
                          backgroundColor: index <= state.currentStep ? '#7c3aed' : '#ffffff'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* QUIZ CONTENT */}
            <div 
              className="pb-16 px-6"
              style={{ paddingTop: 'calc(var(--banner-height, 0px) + 180px)' }}
            >
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.currentStep}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* STEP HEADER - Mobile-First Typography */}
                    <div className="text-center mb-12 md:mb-16 px-4">
                      <motion.div 
                        className="text-6xl md:text-8xl mb-4 md:mb-6"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        {currentStepData.icon}
                      </motion.div>
                      
                      <motion.h1 
                        className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        {currentStepData.title}
                      </motion.h1>
                      
                      <motion.p 
                        className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-3 md:mb-4 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        {currentStepData.subtitle}
                      </motion.p>
                      
                      {currentStepData.description && (
                        <motion.p 
                          className="text-sm md:text-md text-gray-500 max-w-2xl mx-auto leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          {currentStepData.description}
                        </motion.p>
                      )}
                    </div>

                    {/* OPTIONS GRID - Mobile-First Touch Optimized */}
                    <motion.div 
                      className={`grid gap-4 md:gap-6 mb-16 ${
                        currentStepData.options && currentStepData.options.length > 6 
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      {currentStepData.options?.map((option, index) => (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.7 + (index * 0.05),
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleOptionSelect(option.id, option)}
                          className={`
                            relative min-h-[120px] md:min-h-[140px] p-4 md:p-6 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 border-2 overflow-hidden
                            touch-manipulation select-none active:scale-95
                            ${isSelected(option.id)
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500 shadow-2xl transform-gpu'
                              : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-xl'
                            }
                            ${option.premium ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                            /* Enhanced mobile touch targets */
                            sm:hover:scale-105 sm:active:scale-95
                          `}
                          style={{
                            /* Ensure 44px minimum touch target on mobile */
                            minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? '88px' : undefined
                          }}
                        >
                          {/* Premium Badge */}
                          {option.premium && (
                            <div className="absolute top-3 right-3">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs px-2 py-1 rounded-full font-bold text-white">
                                PREMIUM
                              </div>
                            </div>
                          )}

                          {/* Selection Indicator */}
                          {isSelected(option.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 left-3"
                            >
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="text-purple-600 font-bold text-sm">✓</div>
                              </div>
                            </motion.div>
                          )}

                          {/* Content - Mobile Optimized */}
                          <div className="text-3xl md:text-5xl mb-2 md:mb-4">{option.emoji}</div>
                          <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 leading-tight">{option.label}</h3>
                          
                          {option.description && (
                            <p className={`text-sm md:text-sm mb-1 md:mb-2 leading-relaxed ${isSelected(option.id) ? 'text-white/90' : 'text-gray-600'}`}>
                              {option.description}
                            </p>
                          )}
                          
                          {option.subtext && (
                            <p className={`text-xs md:text-xs font-semibold ${isSelected(option.id) ? 'text-white/80' : 'text-purple-600'}`}>
                              {option.subtext}
                            </p>
                          )}

                          {/* Popularity Indicator */}
                          {option.popularity && option.popularity > 80 && (
                            <div className="absolute bottom-3 right-3">
                              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                🔥 Popular
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Mid-Quiz Motivation CTA - After Budget Question */}
                    {state.currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-12"
                      >
                        <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-6 text-white text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
                              <span className="text-xl">🔥</span>
                              <span className="font-bold text-sm">You're Almost There!</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                              Great Choices! Just 3 More Questions...
                            </h3>
                            <p className="text-white/90 mb-4 max-w-2xl mx-auto">
                              You're about to discover festivals that <strong>perfectly match your vibe and budget</strong>. 
                              Want us to save your results + send weekly festival picks that fit your exact preferences?
                            </p>
                            
                            <MidQuizNewsletterForm />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* NAVIGATION - Mobile-First Design */}
                    <motion.div 
                      className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      {/* Mobile: Previous button full width on mobile */}
                      <button
                        onClick={handlePrevious}
                        disabled={state.currentStep === 0 || isTransitioning}
                        className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 md:py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 touch-manipulation"
                        style={{ minHeight: '48px' }} // Ensure 48px minimum touch target
                      >
                        <motion.span
                          className="text-xl"
                          whileHover={{ x: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          ←
                        </motion.span>
                        <span className="font-medium">Previous</span>
                      </button>

                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Selection Counter for Multi-select */}
                        {currentStepData.type === 'multi' && selectedOptions.length > 0 && (
                          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold order-2 sm:order-1">
                            {selectedOptions.length} selected
                          </div>
                        )}

                        {/* Mobile: Next button full width and prominent */}
                        <motion.button
                          onClick={handleNext}
                          disabled={!canProceed() || isTransitioning}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full sm:w-auto px-6 md:px-8 py-4 md:py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 touch-manipulation order-1 sm:order-2"
                          style={{ minHeight: '56px' }} // Larger touch target for primary action
                        >
                          {state.currentStep === totalSteps - 1 ? (
                            <>
                              <span>See My Results</span>
                              <span className="text-xl">🎉</span>
                            </>
                          ) : (
                            <>
                              <span>{currentStepData.type === 'single' ? 'Continue' : 'Next'}</span>
                              <motion.span
                                className="text-xl"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                →
                              </motion.span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Progress Hints */}
                    <motion.div 
                      className="text-center mt-8 text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      {currentStepData.type === 'multi' && (
                        <p>💡 Select multiple options for better recommendations</p>
                      )}
                      {state.currentStep === totalSteps - 1 && (
                        <p>🎯 Almost done! Get ready for your personalized festival matches</p>
                      )}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SimpleQuiz() {
  const { state } = useQuiz();
  
  // If quiz is completed, show results
  if (state.isCompleted) {
    return <FestivalResults />;
  }

  // Otherwise show the quiz content
  return <QuizContent />;
}
