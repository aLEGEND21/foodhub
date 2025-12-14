"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Meal, Food } from "@/lib/types";
import { getFoods, type GetFoodsResult } from "@/lib/actions/meals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState<GetFoodsResult>({
    favoriteFoods: [],
    regularFoods: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch foods from database
  useEffect(() => {
    async function fetchFoods() {
      try {
        const fetchedFoods = await getFoods();
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  // Filter foods based on search
  const filteredFoods = useMemo(() => {
    const sortedFavoriteFoods = foods.favoriteFoods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );
    const sortedRegularFoods = foods.regularFoods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      favoriteFoods: sortedFavoriteFoods,
      regularFoods: sortedRegularFoods,
    };
  }, [search, foods]);

  const handleFoodSelected = (food: Food) => {
    const now = new Date();
    // Convert selected food into a meal (consumption record)
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: food.name,
      emoji: food.emoji,
      calories: food.calories,
      protein: food.protein,
      timestamp: now,
      date: now.toISOString().split("T")[0],
      mealType: "snack", // Default, would need to be set properly in real app
    };
    // Add to today's meals (would need parent state or server action in real app)
    console.log("[v0] Food selected, creating meal:", newMeal);
  };

  return (
    <>
      <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-4 pb-20 md:pb-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Add Meal</h1>
          <p className="text-muted-foreground">
            Select a food to add to your meal log
          </p>
        </div>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg"
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center text-muted-foreground py-8">
            Loading foods...
          </div>
        )}

        {/* Favorite Foods */}
        {!loading && foods.favoriteFoods.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Favorites
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {foods.favoriteFoods.map((food) => (
                <Button
                  key={food.id}
                  onClick={() => handleFoodSelected(food)}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2 bg-accent/10 hover:bg-accent/20 border-accent/30"
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <span className="text-xs text-center leading-tight">
                    {food.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* No Foods Message */}
        {!loading &&
          foods.favoriteFoods.length === 0 &&
          foods.regularFoods.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No foods found. Create your first food!
            </div>
          )}

        {/* All Foods - Alphabetically Organized */}
        {!loading && foods.regularFoods.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              All Foods
            </h3>
            <div className="grid grid-cols-2 gap-2 auto-rows-max">
              {(search
                ? filteredFoods.favoriteFoods
                : filteredFoods.regularFoods
              ).map((food: Food) => (
                <Button
                  key={food.id}
                  onClick={() => handleFoodSelected(food)}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 gap-1 text-center"
                >
                  <span className="text-2xl">{food.emoji}</span>
                  <span className="text-xs leading-tight">{food.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {food.calories} cal
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Food Button */}
        <div className="sticky bottom-0 left-0 right-0 pt-4 bg-background border-t border-border/50 -mx-4 px-4 py-3">
          <Button
            onClick={() => router.push("/add-meal/new")}
            className="w-full"
            size="lg"
          >
            Create Custom Food
          </Button>
        </div>
      </main>
    </>
  );
}
