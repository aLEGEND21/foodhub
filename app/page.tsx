"use client";

import { useState, useEffect } from "react";
import type { Meal, DailyStats } from "@/lib/types";
import { mockAllMeals } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Zap, Apple, Trash2 } from "lucide-react";

export default function HomePage() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(
    new Set(["breakfast", "lunch", "dinner", "snack"])
  );
  const [workoutLevel, setWorkoutLevel] = useState(0);
  const [fruitsCount, setFruitsCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const today_stats = mockAllMeals.find((s) => s.date === today) || {
      date: today,
      totalCalories: 0,
      totalProtein: 0,
      meals: [],
    };
    setTodayStats(today_stats);
    setAllMeals(today_stats.meals);
  }, []);

  const handleDeleteMeal = (id: string) => {
    setAllMeals(allMeals.filter((m) => m.id !== id));
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
    breakfast: allMeals.filter((m) => m.mealType === "breakfast"),
    lunch: allMeals.filter((m) => m.mealType === "lunch"),
    dinner: allMeals.filter((m) => m.mealType === "dinner"),
    snack: allMeals.filter((m) => m.mealType === "snack"),
  };

  const calorieGoal = 2000;
  const proteinGoal = 150;
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
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
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
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
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
        {allMeals.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-muted-foreground">No meals logged yet</p>
              <Button variant="outline" className="mt-3 bg-transparent" asChild>
                <a href="/add-meal">Add your first meal</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map(
              (type) => {
                const meals = mealsByType[type];
                if (meals.length === 0) return null;

                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                const isExpanded = expandedMeals.has(type);
                const sortedMeals = [...meals].sort((a, b) =>
                  a.name.localeCompare(b.name)
                );

                const typeCalories = meals.reduce(
                  (sum, meal) => sum + meal.calories,
                  0
                );

                return (
                  <Card
                    key={type}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-border/50"
                  >
                    <button
                      onClick={() => toggleMealType(type)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-base font-semibold">
                          {typeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">
                            {typeCalories}
                          </p>
                          <p className="text-xs text-muted-foreground">cal</p>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border/50 bg-muted/20">
                        {sortedMeals.map((meal, index) => (
                          <div
                            key={meal.id}
                            className={`flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors group ${
                              index !== sortedMeals.length - 1
                                ? "border-b border-border/30"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-xl">{meal.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm leading-tight">
                                  {meal.name}
                                </p>
                                {meal.note && (
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                                    {meal.note}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-semibold">
                                  {meal.calories}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {meal.protein}g
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMeal(meal.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              }
            )}
          </div>
        )}
      </main>
    </>
  );
}
