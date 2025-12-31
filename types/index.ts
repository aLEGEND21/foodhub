// Import types for use in this file
import type { Meal } from "./meal";

// Re-export all types for convenience
export type { Food } from "./food";
export type { Meal } from "./meal";
export type { Habits } from "./habits";

// Types without corresponding models
export interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  meals: Meal[];
  workoutDone?: boolean;
  fruitsCount?: number; // 0, 1, or 2
}
