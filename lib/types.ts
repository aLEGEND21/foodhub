// Food represents available food options that users can select
export interface Food {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  favorite: boolean;
}

// Meal represents a consumption record - what the user has actually eaten
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
