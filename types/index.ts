// Re-export all types for convenience
export type { Food } from "./food";
export type { Meal } from "./meal";

// Types without corresponding models
export interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  meals: Meal[];
}

export interface HabitState {
  workoutLevel: number; // 0-3
  mealGoalMet: boolean;
  fruitsCount: number;
}
