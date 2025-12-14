// Meal type matching the Meal model structure
// Note: Use 'id' everywhere in frontend/types. Only use '_id' when directly
// interacting with MongoDB models. Server actions convert _id -> id automatically.
export interface Meal {
  id: string; // Always use 'id' in frontend (converted from MongoDB _id)
  name: string;
  calories: number;
  protein: number;
  icon: string; // Matches model field name
  servingSize: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1";
  mealTime: "breakfast" | "lunch" | "dinner" | "snack"; // Matches model field name
  foodId: string; // ObjectId reference to Food
  date: Date; // Matches model field type
}
