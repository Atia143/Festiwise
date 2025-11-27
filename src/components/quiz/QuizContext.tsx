'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

type QuizState = {
  currentStep: number;
  answers: {
    genres: string[];
    budget: { min: number; max: number };
    months: string[];
    region: string;
    vibes: string[];
    duration: 'day' | 'weekend' | 'week+';
    camping: boolean;
    // New preference strength fields
    genreImportance: number; // 1-5
    budgetFlexibility: 'strict' | 'flexible' | 'very flexible';
    dateFlexibility: 'strict' | 'flexible' | 'very flexible';
    audienceSize: 'intimate' | 'medium' | 'massive' | 'any';
    familyFriendly: boolean | 'any';
    // WORLD-CLASS: Additional comprehensive fields
    accommodation: 'camping' | 'glamping' | 'hotel' | 'airbnb' | 'rv' | 'hostel';
    travelStyle: 'solo' | 'couple' | 'friends' | 'family' | 'group';
    foodPreferences: string[]; // vegan, vegetarian, local, gourmet, street-food
    languagePreference: 'english' | 'local' | 'multilingual' | 'any';
    accessibility: string[]; // wheelchair, hearing, visual, mobility
    musicDiscovery: 'mainstream' | 'underground' | 'mixed' | 'experimental';
    socialLevel: 'introverted' | 'balanced' | 'extroverted';
    weatherTolerance: string[]; // hot, cold, rain, wind, humidity
    transportPreference: 'car' | 'public' | 'walking' | 'cycling' | 'any';
    networkingInterest: boolean;
    photographyFocus: boolean;
    sustainabilityImportance: number; // 1-5
  };
  timeSpent: number;
  isCompleted: boolean;
};

type QuizAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ANSWER'; field: keyof QuizState['answers']; value: any }
  | { type: 'SET_BULK_ANSWERS'; answers: Partial<QuizState['answers']> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'TICK' }
  | { type: 'SET_TIME'; value: number }
  | { type: 'RESET_TIME' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  currentStep: 0,
  answers: {
    genres: [],
    budget: { min: 0, max: 5000 },
    months: [],
    region: '',
    vibes: [],
    duration: 'weekend',
    camping: false,
    // Initialize new preference strength fields
    genreImportance: 3,
    budgetFlexibility: 'flexible',
    dateFlexibility: 'flexible',
    audienceSize: 'any',
    familyFriendly: 'any',
    // WORLD-CLASS: Initialize additional comprehensive fields
    accommodation: 'hotel',
    travelStyle: 'friends',
    foodPreferences: [],
    languagePreference: 'any',
    accessibility: [],
    musicDiscovery: 'mixed',
    socialLevel: 'balanced',
    weatherTolerance: [],
    transportPreference: 'any',
    networkingInterest: false,
    photographyFocus: false,
    sustainabilityImportance: 3,
  },
  timeSpent: 0,
  isCompleted: false,
};

type QuizContextType = {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  setAnswer: (field: keyof QuizState['answers'], value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  resetTime: () => void;
};

const QuizContext = createContext<QuizContextType | null>(null);

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  // Development logging disabled for production
  // console.log('🔧 QuizReducer received action:', action.type, action);
  
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: Math.max(0, action.step),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case 'SET_ANSWER':
      // console.log('🔧 Setting answer:', action.field, '=', action.value);
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.field]: action.value,
        },
      };
    case 'SET_BULK_ANSWERS':
      // console.log('🔧 Setting bulk answers:', action.answers);
      const newState = {
        ...state,
        answers: {
          ...state.answers,
          ...action.answers,
        },
      };
      // console.log('🔧 New state after bulk update:', newState);
      return newState;
    case 'TICK':
      return {
        ...state,
        timeSpent: state.timeSpent + 1,
      };
    case 'SET_TIME':
      return {
        ...state,
        timeSpent: action.value,
      };
    case 'RESET_TIME':
      return {
        ...state,
        timeSpent: 0,
      };
    case 'COMPLETE_QUIZ':
      // console.log('🔧 Completing quiz, isCompleted:', true);
      return {
        ...state,
        isCompleted: true,
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Persist quiz state to localStorage (debounced)
  // Key: festi_quiz_v1
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('festi_quiz_v1') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        // Apply saved answers and step
        if (parsed.answers) {
          dispatch({ type: 'SET_BULK_ANSWERS', answers: parsed.answers });
        }
        if (typeof parsed.currentStep === 'number') {
          dispatch({ type: 'SET_STEP', step: parsed.currentStep });
        }
        if (typeof parsed.timeSpent === 'number') {
          dispatch({ type: 'SET_TIME', value: parsed.timeSpent });
        }
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const payload = JSON.stringify({ answers: state.answers, currentStep: state.currentStep, timeSpent: state.timeSpent, updatedAt: Date.now() });
        window.localStorage.setItem('festi_quiz_v1', payload);
      } catch (e) {
        // ignore
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [state.answers, state.currentStep, state.timeSpent]);

  // Tick timer every second while quiz is in progress
  useEffect(() => {
    if (state.isCompleted) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isCompleted]);

  const setAnswer = (field: keyof QuizState['answers'], value: any) => {
    dispatch({ type: 'SET_ANSWER', field, value });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const resetTime = () => {
    dispatch({ type: 'RESET_TIME' });
  };

  const contextValue: QuizContextType = {
    state,
    dispatch,
    setAnswer,
    nextStep,
    prevStep,
    completeQuiz,
    resetQuiz,
    resetTime,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
