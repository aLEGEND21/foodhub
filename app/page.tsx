"use client";

import { useState, useEffect } from "react";
import type { Meal, DailyStats } from "@/types";
import { getTodayMeals, deleteMeal } from "@/lib/actions/meals";
import { CALORIE_GOAL, PROTEIN_GOAL } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Apple, Trash2 } from "lucide-react";

export default function HomePage() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(
    new Set(["breakfast", "lunch", "dinner", "snack"])
  );
  const [workoutLevel, setWorkoutLevel] = useState(0);
  const [fruitsCount, setFruitsCount] = useState(0);

  useEffect(() => {
    const fetchTodayMeals = async () => {
      const todayStats = await getTodayMeals();
      setTodayStats(todayStats);
      setAllMeals(todayStats.meals);
    };
    fetchTodayMeals();
  }, []);

  const handleDeleteMeal = async (id: string) => {
    const result = await deleteMeal(id);
    if (result.success) {
      // Refresh meals from backend
      const todayStats = await getTodayMeals();
      setTodayStats(todayStats);
      setAllMeals(todayStats.meals);
    }
  };

  const toggleMealType = (type: string) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedMeals(newExpanded);
  };

  const handleWorkoutClick = () => {
    setWorkoutLevel((prev) => (prev + 1) % 4);
  };

  const handleFruitsClick = () => {
    setFruitsCount((prev) => (prev + 1) % 6);
  };

  const workoutLabels = ["Not Started", "Warm Up", "In Progress", "Complete"];
  const fruitsLabels = [
    "None",
    "1 Fruit",
    "2 Fruits",
    "3 Fruits",
    "4 Fruits",
    "5+ Fruits",
  ];

  const getWorkoutColor = () => {
    if (workoutLevel === 0) return "bg-muted hover:bg-muted/80";
    if (workoutLevel === 1)
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30";
    if (workoutLevel === 2)
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30";
    return "bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-500/30";
  };

  const getFruitColor = () => {
    if (fruitsCount === 0) return "bg-muted hover:bg-muted/80";
    if (fruitsCount <= 2)
      return "bg-orange-500/20 text-orange-700 dark:text-orange-300 hover:bg-orange-500/30";
    return "bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-500/30";
  };

  const mealsByType = {
    breakfast: allMeals.filter((m) => m.mealTime === "breakfast"),
    lunch: allMeals.filter((m) => m.mealTime === "lunch"),
    dinner: allMeals.filter((m) => m.mealTime === "dinner"),
    snack: allMeals.filter((m) => m.mealTime === "snack"),
  };

  // Use goals from constants
  const calorieGoal = CALORIE_GOAL;
  const proteinGoal = PROTEIN_GOAL;
  const caloriePercent = todayStats
    ? Math.min((todayStats.totalCalories / calorieGoal) * 100, 100)
    : 0;
  const proteinPercent = todayStats
    ? Math.min((todayStats.totalProtein / proteinGoal) * 100, 100)
    : 0;

  return (
    <>
      <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-6 pb-24 md:flex-1 md:overflow-y-auto md:scrollbar-hide md:pb-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Today</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString([], {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Summary */}
        {todayStats && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {todayStats.totalCalories}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Calories
                  </div>
                  <div className="mt-2 bg-muted/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${caloriePercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {calorieGoal} goal
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-linear-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    {todayStats.totalProtein}g
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Protein
                  </div>
                  <div className="mt-2 bg-muted/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${proteinPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {proteinGoal}g goal
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Habits Section */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleWorkoutClick}
            className={`h-16 flex-col gap-1 transition-all ${getWorkoutColor()}`}
            variant="outline"
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs font-medium">
              {workoutLabels[workoutLevel]}
            </span>
          </Button>
          <Button
            onClick={handleFruitsClick}
            className={`h-16 flex-col gap-1 transition-all ${getFruitColor()}`}
            variant="outline"
          >
            <Apple className="w-5 h-5" />
            <span className="text-xs font-medium">
              {fruitsLabels[fruitsCount]}
            </span>
          </Button>
        </div>

        {/* Today's Meals Grouped by Type */}
        <div className="space-y-3">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => {
            const meals = mealsByType[type];
            const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
            const isExpanded = expandedMeals.has(type);
            const sortedMeals = [...meals].sort((a, b) =>
              a.name.localeCompare(b.name)
            );

            const typeCalories = meals.reduce(
              (sum, meal) => sum + meal.calories,
              0
            );
            const typeProtein = meals.reduce(
              (sum, meal) => sum + meal.protein,
              0
            );
            const itemCount = meals.length;

            return (
              <Collapsible
                key={type}
                open={isExpanded}
                onOpenChange={(open) => {
                  if (open) {
                    setExpandedMeals((prev) => new Set(prev).add(type));
                  } else {
                    setExpandedMeals((prev) => {
                      const newSet = new Set(prev);
                      newSet.delete(type);
                      return newSet;
                    });
                  }
                }}
              >
                <Card className="overflow-hidden shadow-sm border-border/50">
                  <CollapsibleTrigger className="w-full px-5 flex items-start justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-base font-semibold">
                        {typeLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <p className="text-sm font-bold text-primary">
                            {typeCalories}
                          </p>
                          <p className="text-xs text-muted-foreground">cal</p>
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <p className="text-sm font-bold text-primary">
                            {typeProtein}
                          </p>
                          <p className="text-xs text-muted-foreground">g</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border/50 bg-muted/20">
                      {sortedMeals.length === 0 ? (
                        <div className="px-5 py-3 text-center">
                          <p className="text-sm text-muted-foreground">
                            No meals logged for {typeLabel.toLowerCase()}
                          </p>
                        </div>
                      ) : (
                        <div className="py-3">
                          {sortedMeals.map((meal, index) => (
                            <div
                              key={meal.id}
                              className={`flex items-center justify-between px-5 py-2 group ${
                                index !== sortedMeals.length - 1
                                  ? "border-b border-border/30"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-base">{meal.icon}</span>
                                <div className="flex-1">
                                  <p className="font-medium text-xs leading-tight">
                                    {meal.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right flex items-center gap-3">
                                  <p className="text-[10px] text-muted-foreground">
                                    {meal.servingSize} serving
                                  </p>
                                  <p className="text-xs font-semibold">
                                    {meal.calories} cal
                                  </p>
                                  <p className="text-xs font-semibold">
                                    {meal.protein} g
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMeal(meal.id);
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </main>
    </>
  );
}
