import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    bestScore: { type: Number, default: 0 },
    totalTimePlayed: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    lastPlayedGame: { type: String },
    lastPlayedDate: { type: Date }
  });
  
  const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
  export default Leaderboard
  