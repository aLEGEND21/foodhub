import type { Meal, DailyStats } from "./types";

const today = new Date();

function getMealType(hour: number): "breakfast" | "lunch" | "dinner" | "snack" {
  if (hour < 11) return "breakfast";
  if (hour < 17) return "lunch";
  if (hour < 21) return "dinner";
  return "snack";
}

export const favoriteMeals: Meal[] = [
  {
    id: "fav-1",
    name: "Chicken Breast",
    emoji: "🍗",
    calories: 165,
    protein: 31,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "fav-2",
    name: "Oatmeal Bowl",
    emoji: "🥣",
    calories: 150,
    protein: 5,
    timestamp: new Date(),
    date: "",
    mealType: "breakfast",
  },
  {
    id: "fav-3",
    name: "Greek Yogurt",
    emoji: "🥛",
    calories: 100,
    protein: 20,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "fav-4",
    name: "Salmon",
    emoji: "🐟",
    calories: 280,
    protein: 25,
    timestamp: new Date(),
    date: "",
    mealType: "dinner",
  },
  {
    id: "fav-5",
    name: "Broccoli & Rice",
    emoji: "🥦",
    calories: 200,
    protein: 8,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
];

export const generateMockMeals = (): DailyStats[] => {
  const stats: DailyStats[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const meals: Meal[] = [
      {
        id: `meal-${dateStr}-1`,
        name: "Oatmeal with Berries",
        emoji: "🥣",
        calories: 320,
        protein: 12,
        note: "Added honey",
        timestamp: new Date(date.setHours(7, 30)),
        date: dateStr,
        mealType: "breakfast",
      },
      {
        id: `meal-${dateStr}-2`,
        name: "Chicken Salad",
        emoji: "🥗",
        calories: 380,
        protein: 35,
        timestamp: new Date(date.setHours(12, 15)),
        date: dateStr,
        mealType: "lunch",
      },
      {
        id: `meal-${dateStr}-3`,
        name: "Greek Yogurt & Granola",
        emoji: "🥛",
        calories: 200,
        protein: 15,
        timestamp: new Date(date.setHours(15, 45)),
        date: dateStr,
        mealType: "snack",
      },
      {
        id: `meal-${dateStr}-4`,
        name: "Grilled Salmon with Broccoli",
        emoji: "🐟",
        calories: 450,
        protein: 42,
        note: "Lemon sauce",
        timestamp: new Date(date.setHours(18, 30)),
        date: dateStr,
        mealType: "dinner",
      },
    ];

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

    stats.push({ date: dateStr, totalCalories, totalProtein, meals });
  }

  return stats;
};

export const mockAllMeals = generateMockMeals();
