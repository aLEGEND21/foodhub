"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewMealPage() {
  const router = useRouter();
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [emoji, setEmoji] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!mealName.trim()) {
      alert("Please enter a meal name");
      return;
    }

    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      alert("Please enter a valid number of calories");
      return;
    }

    if (protein && (isNaN(Number(protein)) || Number(protein) < 0)) {
      alert("Please enter a valid number of protein (0 or greater)");
      return;
    }

    if (!emoji.trim()) {
      alert("Please enter an emoji");
      return;
    }

    // Create meal object
    const newMeal = {
      name: mealName.trim(),
      calories: Number(calories),
      protein: protein ? Number(protein) : 0,
      emoji: emoji.trim(),
    };

    // Log the meal (in a real app, this would save to database)
    console.log("[v0] New meal created:", newMeal);

    // Navigate back to add-meal page
    router.push("/add-meal");
  };

  return (
    <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Custom Meal</h1>
        <p className="text-muted-foreground">Add a new meal to your library</p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-none">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Meal Name Input */}
            <div className="space-y-2">
              <label htmlFor="meal-name" className="text-sm font-medium">
                Meal Name
              </label>
              <Input
                id="meal-name"
                type="text"
                placeholder="e.g., Grilled Salmon"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            {/* Calories Input */}
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium">
                Calories
              </label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="rounded-lg"
                min="1"
                required
              />
            </div>

            {/* Protein Input */}
            <div className="space-y-2">
              <label htmlFor="protein" className="text-sm font-medium">
                Protein (g)
              </label>
              <Input
                id="protein"
                type="number"
                placeholder="e.g., 25"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="rounded-lg"
                min="0"
              />
            </div>

            {/* Emoji Input */}
            <div className="space-y-2">
              <label htmlFor="emoji" className="text-sm font-medium">
                Emoji
              </label>
              <Input
                id="emoji"
                type="text"
                placeholder="e.g., 🐟"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="rounded-lg text-2xl"
                maxLength={2}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Meal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
