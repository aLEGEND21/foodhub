export interface Meal {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  note?: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

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
