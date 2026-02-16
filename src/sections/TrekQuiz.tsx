import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar, Mountain, Users, Wallet, Loader2 } from 'lucide-react';
import type { QuizAnswers, QuizStep } from '../types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrekResults } from '@/components/TrekResults';

const STEPS: QuizStep[] = [
  {
    id: 1,
    question: "How many days do you have for the trek?",
    options: [
      { label: "3-5 days", value: 5, description: "Short & Sweet" },
      { label: "7-10 days", value: 10, description: "Standard Experience" },
      { label: "14+ days", value: 20, description: "Deep Exploration" }
    ]
  },
  {
    id: 2,
    question: "What's your main priority?",
    options: [
      { label: "Mountains", value: "Mountains", description: "Breathtaking peaks & panoramas" },
      { label: "Culture", value: "Culture", description: "Rich heritage & ancient traditions" },
      { label: "Wildlife", value: "Wildlife", description: "Nature's wonders & animals" },
      { label: "Mix", value: "Mix", description: "A bit of everything" }
    ]
  },
  {
    id: 3,
    question: "What's your budget level?",
    options: [
      { label: "Budget", value: "Budget", description: "Economical teahouse trekking" },
      { label: "Mid-range", value: "Mid-range", description: "Comfortable stays & good meals" },
      { label: "Luxury", value: "Luxury", description: "Premium lodges & services" }
    ]
  },
  {
    id: 4,
    question: "What's your fitness level?",
    options: [
      { label: "Beginner", value: "Beginner", description: "Comfortable with 3-4h walking" },
      { label: "Moderate", value: "Moderate", description: "Regular hiker, 5-6h walking" },
      { label: "Experienced", value: "Experienced", description: "Long days, steep climbs, high altitude" }
    ]
  },
  {
    id: 5,
    question: "What's your preferred travel style?",
    options: [
      { label: "Solo", value: "solo", description: "Independence & quietness" },
      { label: "Group/Trek Partner", value: "group", description: "Social experience & shared memories" }
    ]
  }
];

export const TrekQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('trek_quiz_state');
    if (saved) {
      const { currentStep, answers } = JSON.parse(saved);
      setCurrentStep(currentStep);
      setAnswers(answers);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('trek_quiz_state', JSON.stringify({ currentStep, answers }));
  }, [currentStep, answers]);

  const handleOptionSelect = (value: any) => {
    const fieldMap = ['days', 'priority', 'budget', 'fitness', 'style'];
    const currentField = fieldMap[currentStep];
    
    setAnswers(prev => ({ ...prev, [currentField]: value }));
    
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setShowResults(true);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    localStorage.removeItem('trek_quiz_state');
  };

  if (showResults) {
    return <TrekResults answers={answers as QuizAnswers} onReset={resetQuiz} />;
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep];

  return (
    <section id="trek-quiz" className="py-24 px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-foreground mb-4"
          >
            Find Your Perfect Trek
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Answer a few questions and our AI will match you with the ideal Nepal adventure.
          </motion.p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-border/50 p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full">
            <Progress value={progress} className="h-1.5 rounded-none bg-muted" />
          </div>

          <div className="flex justify-between items-center mb-8 pt-4">
            <span className="text-sm font-medium text-muted-foreground/60">Step {currentStep + 1} of {STEPS.length}</span>
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                {step.question}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {step.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      group relative w-full p-6 text-left rounded-2xl border-2 transition-all duration-200
                      ${answers[Object.keys(answers)[currentStep] as keyof QuizAnswers] === option.value
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{option.label}</p>
                        {option.description && (
                          <p className="text-muted-foreground mt-1">{option.description}</p>
                        )}
                      </div>
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${answers[Object.keys(answers)[currentStep] as keyof QuizAnswers] === option.value
                          ? 'border-primary bg-primary'
                          : 'border-neutral-200'}
                      `}>
                        {answers[Object.keys(answers)[currentStep] as keyof QuizAnswers] === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-foreground font-medium">Matching treks for you...</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center gap-8 text-muted-foreground/40">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Days</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5" />
            <span className="text-sm">Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Style</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Budget</span>
          </div>
        </div>
      </div>
    </section>
  );
};
