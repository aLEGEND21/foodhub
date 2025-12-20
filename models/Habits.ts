import mongoose from "mongoose";

const HabitsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Ensure only one document per date
  },
  workoutDone: {
    type: Boolean,
    required: true,
    default: false,
  },
  fruitsCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 2, // 0, 1, or 2 fruits
  },
});

export default mongoose.models.Habits || mongoose.model("Habits", HabitsSchema);
