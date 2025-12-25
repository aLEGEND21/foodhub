"use client";

import { Button } from "@/components/ui/button";
import { createMeal, getFoodById } from "@/lib/actions/meals";
import { cn, getLocalDateString } from "@/lib/utils";
import type { Food } from "@/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type MealTime = "breakfast" | "lunch" | "dinner" | "snack";
type ServingSize = "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1";

const MEAL_TYPES: { value: MealTime; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "🍽️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snack", label: "Snack", emoji: "🍪" },
];

const SERVING_SIZES: ServingSize[] = ["1/4", "1/3", "1/2", "2/3", "3/4", "1"];

/**
 * Determines the meal time based on the current hour of the day
 * - 4 AM - 12 PM: Breakfast
 * - 12 PM - 5 PM: Lunch
 * - 5 PM - 10 PM: Dinner
 * - 10 PM - 4 AM: Snack
 */
function getMealTimeFromHour(): MealTime {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 12) {
    return "breakfast";
  } else if (hour >= 12 && hour < 17) {
    return "lunch";
  } else if (hour >= 17 && hour < 22) {
    return "dinner";
  } else {
    return "snack";
  }
}

export default function SelectMealPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const foodId = params.foodId as string;
  const dateParam = searchParams.get("date");

  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime | null>(
    getMealTimeFromHour(),
  );
  const [selectedServingSize, setSelectedServingSize] =
    useState<ServingSize>("1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFood() {
      try {
        const fetchedFood = await getFoodById(foodId);
        if (!fetchedFood) {
          setError("Food not found");
          return;
        }
        setFood(fetchedFood);
      } catch (err) {
        console.error("Error fetching food:", err);
        setError("Failed to load food");
      } finally {
        setLoading(false);
      }
    }
    fetchFood();
  }, [foodId]);

  const handleSubmit = async () => {
    if (!selectedMealTime || !selectedServingSize) {
      setError("Please select both meal type and serving size");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Use date from query param if available, otherwise use today
      const targetDate = dateParam || getLocalDateString();
      const today = getLocalDateString();
      const isToday = targetDate === today;

      const result = await createMeal(
        {
          foodId,
          mealTime: selectedMealTime,
          servingSize: selectedServingSize,
          date: targetDate,
        },
        { isToday },
      );

      // If we get here, there was an error (success redirects server-side)
      if (result && !result.success) {
        setError(result.message);
      }
      // If redirect happened, Next.js handles it automatically and we won't reach here
    } catch (err) {
      // Next.js redirect() throws, but Next.js handles it automatically
      // Only handle actual errors
      const error = err as any;
      if (error?.digest?.startsWith("NEXT_REDIRECT")) {
        // This is a redirect, Next.js will handle it
        return;
      }
      console.error("Error creating meal:", err);
      setError("Failed to add meal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getServingMultiplier = (size: ServingSize): number => {
    const multipliers: Record<ServingSize, number> = {
      "1/4": 0.25,
      "1/3": 0.333,
      "1/2": 0.5,
      "2/3": 0.667,
      "3/4": 0.75,
      "1": 1.0,
    };
    return multipliers[size];
  };

  const calculateAdjustedValues = (size: ServingSize | null) => {
    if (!food || !size) return { calories: 0, protein: 0 };
    const multiplier = getServingMultiplier(size);
    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier),
    };
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-20 md:pb-4">
        <div className="text-muted-foreground py-8 text-center">Loading...</div>
      </main>
    );
  }

  if (error && !food) {
    return (
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-20 md:pb-4">
        <div className="text-destructive py-8 text-center">{error}</div>
        <Button onClick={() => router.push("/add-meal")} className="w-full">
          Go Back
        </Button>
      </main>
    );
  }

  if (!food) {
    return null;
  }

  const adjustedValues = calculateAdjustedValues(selectedServingSize);

  return (
    <main className="mx-auto w-full max-w-md space-y-6 px-5 pt-8 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">{food.name}</h1>
        <span className="text-4xl">{food.icon}</span>
        <div className="flex w-full items-center justify-center gap-10">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">{food.calories}</span>
            <span className="text-muted-foreground text-sm">cal</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">{food.protein}</span>
            <span className="text-muted-foreground text-sm">g protein</span>
          </div>
        </div>
      </div>

      {/* Meal Type Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Meal Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_TYPES.map((mealType) => (
            <Button
              key={mealType.value}
              onClick={() => setSelectedMealTime(mealType.value)}
              variant={
                selectedMealTime === mealType.value ? "default" : "outline"
              }
              className={cn(
                "flex h-20 flex-col items-center justify-center gap-2",
                selectedMealTime === mealType.value &&
                  "bg-primary text-primary-foreground",
              )}
            >
              <span className="text-2xl">{mealType.emoji}</span>
              <span className="text-sm font-medium">{mealType.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Serving Size Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Serving Size</h2>
        <div className="grid grid-cols-3 gap-2">
          {SERVING_SIZES.map((size) => (
            <Button
              key={size}
              onClick={() => setSelectedServingSize(size)}
              variant={selectedServingSize === size ? "default" : "outline"}
              className={cn(
                "flex h-16 items-center justify-center",
                selectedServingSize === size &&
                  "bg-primary text-primary-foreground",
              )}
            >
              <span className="text-lg font-semibold">{size}</span>
            </Button>
          ))}
        </div>
        {selectedServingSize && (
          <div className="text-muted-foreground pt-2 text-center text-sm">
            {adjustedValues.calories} calories • {adjustedValues.protein}g
            protein
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-destructive bg-destructive/10 rounded-md p-3 text-center text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="bg-background border-border/50 sticky right-0 bottom-0 left-0 -mx-4 border-t px-4 py-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedMealTime || !selectedServingSize || submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? "Adding Meal..." : "Add Meal"}
        </Button>
      </div>
    </main>
  );
}
