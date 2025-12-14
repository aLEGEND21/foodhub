"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Food from "@/models/Food";
import Meal from "@/models/Meal";
import { revalidatePath } from "next/cache";
import type { Food as FoodType } from "@/lib/types";

// Zod schema for food validation
const createFoodSchema = z.object({
  name: z.string().trim().min(1, "Food name is required"),
  calories: z
    .number()
    .int("Calories must be a whole number")
    .positive("Calories must be a positive number"),
  protein: z
    .number()
    .int("Protein must be a whole number")
    .min(0, "Protein must be 0 or greater"),
  emoji: z
    .string()
    .trim()
    .min(1, "Emoji is required")
    .max(2, "Emoji should be 1-2 characters"),
});

export type CreateFoodInput = z.infer<typeof createFoodSchema>;

export interface CreateFoodResult {
  success: boolean;
  message: string;
}

export async function createFood(
  prevState: CreateFoodResult | null, // Required for useActionState hook
  formData: FormData
): Promise<CreateFoodResult> {
  try {
    // Extract form data
    const input = {
      name: formData.get("name") as string,
      calories: Number(formData.get("calories")),
      protein: Number(formData.get("protein")),
      emoji: formData.get("emoji") as string,
    };

    // Validate input with Zod
    const validationResult = createFoodSchema.safeParse(input);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Validation failed",
      };
    }

    const validatedInput = validationResult.data;

    // Connect to database
    await dbConnect();

    // Check if food with same name already exists
    const existingFood = await Food.findOne({
      name: validatedInput.name,
    });

    if (existingFood) {
      return {
        success: false,
        message: "A food with this name already exists",
      };
    }

    // Create new food
    await Food.create({
      name: validatedInput.name,
      calories: validatedInput.calories,
      protein: validatedInput.protein,
      icon: validatedInput.emoji,
      favorite: false,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while creating the food",
    };
  }

  // Revalidate the add-meal page to show the new food
  revalidatePath("/add-meal");

  // Redirect on success - this happens server-side
  redirect("/add-meal");
}

export interface GetFoodsResult {
  favoriteFoods: FoodType[];
  regularFoods: FoodType[];
}

export async function getFoods(): Promise<GetFoodsResult> {
  try {
    await dbConnect();

    // Fetch foods from database
    let favoriteFoods = await Food.find({ favorite: true }).sort({ name: 1 });
    let regularFoods = await Food.find({ favorite: false }).sort({ name: 1 });

    // Reformat fields to match Food type
    const formattedFavoriteFoods: FoodType[] = favoriteFoods.map((food) => ({
      id: food._id.toString(),
      name: food.name,
      emoji: food.icon,
      calories: food.calories,
      protein: food.protein,
      favorite: true,
    }));
    const formattedRegularFoods: FoodType[] = regularFoods.map((food) => ({
      id: food._id.toString(),
      name: food.name,
      emoji: food.icon,
      calories: food.calories,
      protein: food.protein,
      favorite: false,
    }));

    return {
      favoriteFoods: formattedFavoriteFoods,
      regularFoods: formattedRegularFoods,
    };
  } catch (error) {
    console.error("Error fetching foods:", error);
    return { favoriteFoods: [], regularFoods: [] };
  }
}

// Zod schema for meal creation validation
const createMealSchema = z.object({
  foodId: z.string().min(1, "Food ID is required"),
  mealTime: z.enum(["breakfast", "lunch", "dinner", "snack"], {
    message: "Invalid meal type",
  }),
  servingSize: z.enum(["1/4", "1/3", "1/2", "2/3", "3/4", "1"], {
    message: "Invalid serving size",
  }),
});

export type CreateMealInput = z.infer<typeof createMealSchema>;

export interface CreateMealResult {
  success: boolean;
  message: string;
}

// Helper function to convert serving size to multiplier
function getServingMultiplier(servingSize: string): number {
  const multipliers: Record<string, number> = {
    "1/4": 0.25,
    "1/3": 0.333,
    "1/2": 0.5,
    "2/3": 0.667,
    "3/4": 0.75,
    "1": 1.0,
  };
  return multipliers[servingSize] || 1.0;
}

export async function createMeal(
  input: CreateMealInput
): Promise<CreateMealResult> {
  try {
    // Validate input with Zod
    const validationResult = createMealSchema.safeParse(input);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Validation failed",
      };
    }

    const validatedInput = validationResult.data;

    // Connect to database
    await dbConnect();

    // Fetch the food to get base nutritional values
    const food = await Food.findById(validatedInput.foodId);
    if (!food) {
      return {
        success: false,
        message: "Food not found",
      };
    }

    // Calculate adjusted values based on serving size
    const multiplier = getServingMultiplier(validatedInput.servingSize);
    const adjustedCalories = Math.round(food.calories * multiplier);
    const adjustedProtein = Math.round(food.protein * multiplier);

    // Create new meal
    await Meal.create({
      name: food.name,
      calories: adjustedCalories,
      protein: adjustedProtein,
      icon: food.icon,
      servingSize: validatedInput.servingSize,
      mealTime: validatedInput.mealTime,
      foodId: validatedInput.foodId,
    });

    // Revalidate relevant paths
    revalidatePath("/add-meal");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating meal:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while creating the meal",
    };
  }

  // Redirect on success - this happens server-side
  redirect("/add-meal");
}

export async function getFoodById(foodId: string): Promise<FoodType | null> {
  try {
    await dbConnect();
    const food = await Food.findById(foodId);
    if (!food) {
      return null;
    }
    return {
      id: food._id.toString(),
      name: food.name,
      emoji: food.icon,
      calories: food.calories,
      protein: food.protein,
      favorite: food.favorite || false,
    };
  } catch (error) {
    console.error("Error fetching food:", error);
    return null;
  }
}
