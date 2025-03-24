import mongoose from "mongoose";

const userGameProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gameSlug: { type: String, required: true },
    bestScore: { type: Number, default: 0 },
    totalTimePlayed: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    lastPlayedAt: { type: Date, default: Date.now },
  });
  
  const UserGameProgress = mongoose.model("UserGameProgress", userGameProgressSchema);
export default UserGameProgress  