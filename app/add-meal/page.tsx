"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Food } from "@/types";
import { getFoods, type GetFoodsResult } from "@/lib/actions/meals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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
    // Navigate to selection page where user can choose meal type and serving size
    router.push(`/add-meal/select/${food.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, food: Food) => {
    e.stopPropagation();
    // Empty callback handler for now
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
        {!loading && filteredFoods.favoriteFoods.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Favorites
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {filteredFoods.favoriteFoods.map((food) => (
                <Card
                  key={food.id}
                  onClick={() => handleFoodSelected(food)}
                  className="relative cursor-pointer hover:bg-accent/5 transition-colors border-accent/30 bg-accent/10"
                >
                  <CardContent className="px-3 py-1 flex flex-col items-center gap-2">
                    <button
                      onClick={(e) => handleFavoriteClick(e, food)}
                      className="absolute top-2 right-2 p-1 hover:opacity-80 transition-opacity z-10"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          food.favorite
                            ? "fill-orange-500 text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <h3 className="text-sm font-medium text-center mt-1">
                      {food.name}
                    </h3>
                    <span className="text-3xl">{food.icon}</span>
                    <div className="flex items-center gap-2 w-full justify-center mt-auto pt-1">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold">
                          {food.calories}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          cal
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold">
                          {food.protein}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          grams
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Foods Message */}
        {!loading &&
          filteredFoods.favoriteFoods.length === 0 &&
          filteredFoods.regularFoods.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {search
                ? "No foods found matching your search."
                : "No foods found. Create your first food!"}
            </div>
          )}

        {/* All Foods - Alphabetically Organized */}
        {!loading && filteredFoods.regularFoods.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              All Foods
            </h3>
            <div className="grid grid-cols-2 gap-2 auto-rows-max">
              {filteredFoods.regularFoods.map((food: Food) => (
                <Card
                  key={food.id}
                  onClick={() => handleFoodSelected(food)}
                  className="relative cursor-pointer hover:bg-accent/5 transition-colors"
                >
                  <CardContent className="px-4 py-1 flex flex-col items-center gap-3">
                    <button
                      onClick={(e) => handleFavoriteClick(e, food)}
                      className="absolute top-2 right-2 p-1 hover:opacity-80 transition-opacity z-10"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          food.favorite
                            ? "fill-orange-500 text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <h3 className="text-base font-medium text-center mt-1">
                      {food.name}
                    </h3>
                    <span className="text-4xl">{food.icon}</span>
                    <div className="flex items-center gap-4 w-full justify-center mt-auto pt-2">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold">
                          {food.calories}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          cal
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold">
                          {food.protein}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          grams
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
