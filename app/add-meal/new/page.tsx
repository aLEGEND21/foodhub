"use client";

import { useActionState } from "react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createFood } from "@/lib/actions/meals";

export default function NewMealPage() {
  const [state, formAction, isPending] = useActionState(createFood, null);

  return (
    <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Custom Food</h1>
        <p className="text-muted-foreground">
          Add a new food option to your library
        </p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-none">
        <CardContent className="pt-6">
          {state && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {state.message}
            </div>
          )}
          <Form action={formAction} className="space-y-4">
            {/* Food Name Input */}
            <div className="space-y-2">
              <label htmlFor="food-name" className="text-sm font-medium">
                Food Name
              </label>
              <Input
                id="food-name"
                name="name"
                type="text"
                placeholder="e.g., Grilled Salmon"
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
                name="calories"
                type="number"
                placeholder="e.g., 350"
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
                name="protein"
                type="number"
                placeholder="e.g., 25"
                className="rounded-lg"
                min="0"
                required
              />
            </div>

            {/* Emoji Input */}
            <div className="space-y-2">
              <label htmlFor="emoji" className="text-sm font-medium">
                Emoji
              </label>
              <Input
                id="emoji"
                name="emoji"
                type="text"
                placeholder="e.g., 🐟"
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
                onClick={() => window.history.back()}
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Creating..." : "Create Food"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
