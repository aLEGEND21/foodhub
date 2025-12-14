import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  icon: { type: String, required: true },
  favorite: { type: Boolean, default: false },
});

export default mongoose.models.Food || mongoose.model("Food", FoodSchema);
