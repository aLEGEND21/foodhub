// Food type matching the Food model structure
// Note: Use 'id' everywhere in frontend/types. Only use '_id' when directly
// interacting with MongoDB models. Server actions convert _id -> id automatically.
export interface Food {
  id: string; // Always use 'id' in frontend (converted from MongoDB _id)
  name: string;
  calories: number;
  protein: number;
  icon: string; // Matches model field name
  favorite: boolean;
}
