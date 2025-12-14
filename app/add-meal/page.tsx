"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Meal } from "@/lib/types";
import { favoriteMeals } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Additional meals beyond favorites for the meal library
const additionalMeals: Meal[] = [
  {
    id: "lib-1",
    name: "Almonds",
    emoji: "🥜",
    calories: 160,
    protein: 6,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-2",
    name: "Apple",
    emoji: "🍎",
    calories: 95,
    protein: 0,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-3",
    name: "Avocado Toast",
    emoji: "🥑",
    calories: 280,
    protein: 10,
    timestamp: new Date(),
    date: "",
    mealType: "breakfast",
  },
  {
    id: "lib-4",
    name: "Banana",
    emoji: "🍌",
    calories: 105,
    protein: 1,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-5",
    name: "Beef Burger",
    emoji: "🍔",
    calories: 540,
    protein: 28,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-6",
    name: "Boiled Eggs",
    emoji: "🥚",
    calories: 155,
    protein: 13,
    timestamp: new Date(),
    date: "",
    mealType: "breakfast",
  },
  {
    id: "lib-7",
    name: "Brown Rice & Chicken",
    emoji: "🍚",
    calories: 420,
    protein: 38,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-8",
    name: "Carrot Sticks",
    emoji: "🥕",
    calories: 35,
    protein: 0,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-9",
    name: "Caesar Salad",
    emoji: "🥗",
    calories: 350,
    protein: 18,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-10",
    name: "Cottage Cheese",
    emoji: "🥛",
    calories: 110,
    protein: 28,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-11",
    name: "Grilled Chicken Breast",
    emoji: "🍗",
    calories: 165,
    protein: 31,
    timestamp: new Date(),
    date: "",
    mealType: "dinner",
  },
  {
    id: "lib-12",
    name: "Hummus & Veggies",
    emoji: "🥒",
    calories: 180,
    protein: 6,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-13",
    name: "Pasta Carbonara",
    emoji: "🍝",
    calories: 480,
    protein: 18,
    timestamp: new Date(),
    date: "",
    mealType: "dinner",
  },
  {
    id: "lib-14",
    name: "Peanut Butter Sandwich",
    emoji: "🥜",
    calories: 340,
    protein: 12,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-15",
    name: "Pizza Slice",
    emoji: "🍕",
    calories: 285,
    protein: 12,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-16",
    name: "Protein Shake",
    emoji: "🥤",
    calories: 200,
    protein: 25,
    timestamp: new Date(),
    date: "",
    mealType: "snack",
  },
  {
    id: "lib-17",
    name: "Taco",
    emoji: "🌮",
    calories: 210,
    protein: 9,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
  {
    id: "lib-18",
    name: "Turkey Sandwich",
    emoji: "🥪",
    calories: 320,
    protein: 22,
    timestamp: new Date(),
    date: "",
    mealType: "lunch",
  },
];

export default function AddPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Filter meals based on search
  const filteredMeals = useMemo(() => {
    const allAvailableMeals = [...additionalMeals];
    const query = search.toLowerCase();

    if (!query) return allAvailableMeals;

    return allAvailableMeals
      .filter((meal) => meal.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search]);

  // All meals sorted alphabetically
  const allMealsSorted = useMemo(() => {
    return [...additionalMeals].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleMealSelected = (meal: Meal) => {
    const now = new Date();
    const newMeal: Meal = {
      ...meal,
      id: `meal-${Date.now()}`,
      timestamp: now,
      date: now.toISOString().split("T")[0],
    };
    // Add to today's meals (would need parent state or server action in real app)
    console.log("[v0] Meal selected:", newMeal);
  };

  return (
    <>
      <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-4 pb-20 md:pb-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Add Meal</h1>
          <p className="text-muted-foreground">
            Quick add or create a new meal
          </p>
        </div>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg"
        />

        {/* Favorite Meals */}
        {favoriteMeals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Favorites
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {favoriteMeals.map((meal) => (
                <Button
                  key={meal.id}
                  onClick={() => handleMealSelected(meal)}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2 bg-accent/10 hover:bg-accent/20 border-accent/30"
                >
                  <span className="text-3xl">{meal.emoji}</span>
                  <span className="text-xs text-center leading-tight">
                    {meal.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* All Meals - Alphabetically Organized */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            All Meals
          </h3>
          <div className="grid grid-cols-2 gap-2 auto-rows-max">
            {(search ? filteredMeals : allMealsSorted).map((meal) => (
              <Button
                key={meal.id}
                onClick={() => handleMealSelected(meal)}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-1 text-center"
              >
                <span className="text-2xl">{meal.emoji}</span>
                <span className="text-xs leading-tight">{meal.name}</span>
                <span className="text-xs text-muted-foreground">
                  {meal.calories} cal
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Meal Button */}
        <div className="sticky bottom-0 left-0 right-0 pt-4 bg-background border-t border-border/50 -mx-4 px-4 py-3">
          <Button
            onClick={() => router.push("/add-meal/new")}
            className="w-full"
            size="lg"
          >
            Create Custom Meal
          </Button>
        </div>
      </main>
    </>
  );
}
