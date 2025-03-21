import mongoose from "mongoose";

const gameSession = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gameSlug: { type: String, required: true },
  score: { type: String, default: 0 },
  timeTaken: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  datePlayed: { type: Date, default: Date.now },
});

const GameSession = mongoose.model("GameSession", gameSession)
export default GameSession