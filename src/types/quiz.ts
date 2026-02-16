export type PriorityType = 'Mountains' | 'Culture' | 'Wildlife' | 'Mix';
export type BudgetLevel = 'Budget' | 'Mid-range' | 'Luxury';
export type FitnessLevel = 'Beginner' | 'Moderate' | 'Experienced';
export type TravelStyle = 'Solo' | 'Group/Trekking partner';

export interface QuizAnswers {
  days: number;
  priority: PriorityType;
  budget: BudgetLevel;
  fitness: FitnessLevel;
  style: 'solo' | 'group';
}

export interface Trek {
  id: string;
  name: string;
  description: string;
  image_url: string;
  min_days: number;
  max_days: number;
  priority_type: PriorityType[];
  budget_level: BudgetLevel;
  fitness_required: FitnessLevel;
  ideal_for: ('solo' | 'group')[];
  highlights: string[];
  best_season: string;
  permit_required: boolean;
  estimated_cost_usd: number;
}

export interface QuizStep {
  id: number;
  question: string;
  options: {
    label: string;
    value: any;
    description?: string;
  }[];
}
