import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, DollarSign, Dumbbell, AlertTriangle, RefreshCcw, Sparkles, Loader2 } from 'lucide-react';
import type { QuizAnswers, Trek } from '../types/quiz';
import { supabase } from '@/lib/supabase';
import { fallbackTreks } from '../data/trekData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIChatExpert } from './AIChatExpert';

interface TrekResultsProps {
  answers: QuizAnswers;
  onReset: () => void;
}

export const TrekResults: React.FC<TrekResultsProps> = ({ answers, onReset }) => {
  const [matches, setMatches] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('destinations')
          .select('*')
        
        let treksToFilter: Trek[] = [];
        
        if (data && data.length > 0) {
          treksToFilter = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            description: d.description,
            image_url: d.image,
            min_days: d.min_days || 3,
            max_days: d.max_days || 15,
            priority_type: d.priority_type || ['Mountains'],
            budget_level: d.budget_level || 'Mid-range',
            fitness_required: d.fitness_required || 'Moderate',
            ideal_for: d.ideal_for || ['solo', 'group'],
            highlights: d.highlights || [],
            best_season: d.best_season || 'March-May',
            permit_required: d.permit_required || false,
            estimated_cost_usd: d.estimated_cost_usd || 500
          }));
        } else {
          console.warn("Supabase returned no treks, using fallback data.");
          treksToFilter = fallbackTreks;
        }

        const scored = treksToFilter.map(trek => {
          let score = 0;
          if (answers.days >= trek.min_days && answers.days <= trek.max_days) score += 30;
          else if (Math.abs(answers.days - trek.min_days) <= 2) score += 10;
          if (trek.priority_type.includes(answers.priority)) score += 25;
          if (trek.budget_level === answers.budget) score += 15;
          const fitnessRanks = { 'Beginner': 1, 'Moderate': 2, 'Experienced': 3 };
          const userFitRank = fitnessRanks[answers.fitness as keyof typeof fitnessRanks];
          const trekFitRank = fitnessRanks[trek.fitness_required as keyof typeof fitnessRanks];
          if (trekFitRank <= userFitRank) score += 20;
          if (trek.ideal_for.includes(answers.style)) score += 10;
          return { trek, score };
        });

        const sorted = scored
          .sort((a, b) => b.score - a.score)
          .map(s => s.trek)
          .slice(0, 3);

        setMatches(sorted);
      } catch (err) {
        console.error("Filter error:", err);
        setMatches(fallbackTreks.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [answers]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Analyzing your preferences...</p>
      </div>
    );
  }

  const bestMatch = matches[0];
  const alternatives = matches.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-4 py-1">
          Quiz Completed
        </Badge>
        <h2 className="text-4xl font-bold text-foreground mb-2">Your Perfect Nepal Treks</h2>
        <p className="text-muted-foreground">Based on your preferences, we've found these matches for you.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Recommendation */}
        <div className="lg:col-span-8">
          {bestMatch ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl group">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={bestMatch.image_url} alt={bestMatch.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-primary text-white text-lg py-2 px-6 rounded-full shadow-lg">
                      #1 Best Match
                    </Badge>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-bold text-white mb-2">{bestMatch.name}</h3>
                    <div className="flex flex-wrap gap-4 text-white/90">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {bestMatch.min_days}-{bestMatch.max_days} Days</span>
                      <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> {bestMatch.fitness_required}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Est. ${bestMatch.estimated_cost_usd}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       Why this fits you
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      This trek perfectly aligns with your {answers.priority.toLowerCase()} priority and fits into your {answers.days} day schedule. 
                      {bestMatch.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">Highlights</h4>
                      <ul className="space-y-2">
                        {bestMatch.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary" /> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">Quick Facts</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Best Season:</span>
                          <span className="font-semibold text-foreground">{bestMatch.best_season}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Permit Required:</span>
                          <span className="font-semibold text-foreground">{bestMatch.permit_required ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Ideal For:</span>
                          <span className="font-semibold capitalize text-foreground">{bestMatch.ideal_for.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
             <div className="bg-muted/50 rounded-3xl p-12 text-center border border-dashed border-muted-foreground/20">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">No perfect matches found</h3>
                <p className="text-muted-foreground">Try adjusting your filters for better results.</p>
             </div>
          )}
        </div>

        {/* Alternatives & Action */}
        <div className="lg:col-span-4 space-y-6">
          <h4 className="text-lg font-bold text-foreground mb-4">You might also like</h4>
          {alternatives.map((alt, idx) => (
            <motion.div
              key={alt.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow border-muted/30 rounded-2xl bg-card">
                <div className="flex h-36">
                  <div className="w-1/3 overflow-hidden">
                    <img src={alt.image_url} alt={alt.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="w-2/3 p-4">
                    <h5 className="font-bold text-foreground mb-1">{alt.name}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{alt.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-xs font-semibold text-primary">{alt.min_days} Days</span>
                       <Badge variant="secondary" className="text-[10px] py-0 px-2 bg-secondary text-secondary-foreground">{alt.fitness_required}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <Card className="p-6 bg-primary/5 border-primary/10 rounded-2xl mt-8">
            <h4 className="font-bold text-foreground mb-4">Not satisfied?</h4>
            <Button onClick={onReset} variant="outline" className="w-full bg-background border-border hover:bg-muted transition-colors">
              <RefreshCcw className="w-4 h-4 mr-2" /> Start Quiz Again
            </Button>
          </Card>
        </div>
      </div>

      {/* AI Expert Button & Chat (Floating) */}
      <AIChatExpert matches={matches} answers={answers} />
    </div>
  );
};
