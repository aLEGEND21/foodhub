import type { Meal, DailyStats } from "@/types";

const today = new Date();

function getMealTime(hour: number): "breakfast" | "lunch" | "dinner" | "snack" {
  if (hour < 11) return "breakfast";
  if (hour < 17) return "lunch";
  if (hour < 21) return "dinner";
  return "snack";
}

export const favoriteMeals: Meal[] = [
  {
    id: "fav-1",
    name: "Chicken Breast",
    icon: "🍗",
    calories: 165,
    protein: 31,
    servingSize: "1",
    mealTime: "lunch",
    foodId: "food-1",
    date: new Date(),
  },
  {
    id: "fav-2",
    name: "Oatmeal Bowl",
    icon: "🥣",
    calories: 150,
    protein: 5,
    servingSize: "1",
    mealTime: "breakfast",
    foodId: "food-2",
    date: new Date(),
  },
  {
    id: "fav-3",
    name: "Greek Yogurt",
    icon: "🥛",
    calories: 100,
    protein: 20,
    servingSize: "1",
    mealTime: "snack",
    foodId: "food-3",
    date: new Date(),
  },
  {
    id: "fav-4",
    name: "Salmon",
    icon: "🐟",
    calories: 280,
    protein: 25,
    servingSize: "1",
    mealTime: "dinner",
    foodId: "food-4",
    date: new Date(),
  },
  {
    id: "fav-5",
    name: "Broccoli & Rice",
    icon: "🥦",
    calories: 200,
    protein: 8,
    servingSize: "1",
    mealTime: "lunch",
    foodId: "food-5",
    date: new Date(),
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
        icon: "🥣",
        calories: 320,
        protein: 12,
        servingSize: "1",
        mealTime: "breakfast",
        foodId: "food-1",
        date: new Date(date.setHours(7, 30)),
      },
      {
        id: `meal-${dateStr}-2`,
        name: "Chicken Salad",
        icon: "🥗",
        calories: 380,
        protein: 35,
        servingSize: "1",
        mealTime: "lunch",
        foodId: "food-2",
        date: new Date(date.setHours(12, 15)),
      },
      {
        id: `meal-${dateStr}-3`,
        name: "Greek Yogurt & Granola",
        icon: "🥛",
        calories: 200,
        protein: 15,
        servingSize: "1",
        mealTime: "snack",
        foodId: "food-3",
        date: new Date(date.setHours(15, 45)),
      },
      {
        id: `meal-${dateStr}-4`,
        name: "Grilled Salmon with Broccoli",
        icon: "🐟",
        calories: 450,
        protein: 42,
        servingSize: "1",
        mealTime: "dinner",
        foodId: "food-4",
        date: new Date(date.setHours(18, 30)),
      },
    ];

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

    stats.push({ date: dateStr, totalCalories, totalProtein, meals });
  }

  return stats;
};

export const mockAllMeals = generateMockMeals();
