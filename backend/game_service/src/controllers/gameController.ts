import { Request, Response } from "express";
import Game from "../models/gameSchema";
import GameSession from "../models/gameSession";
import { userCache } from "../consumers/userConsumer";
import Leaderboard from "../models/leaderboardSchema";
import axios = require("axios");

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

interface User{
  _id: string,
  name:string,
  profilePic:string,
}

export const getAllGames = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("shadil ", userCache);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const games = await Game.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return res.status(200).json({ message: "Game fetched successfully", games });
};

export const createGameSession = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { userId, gameSlug, score, completed, timeTaken } = req.body;

  let pointsEarned = 0;

  if (completed) {
    const gamePoints: Record<string, number> = {
      "tic_tac_toe": 50,
      "memory_game": 100,
      "word-builder": 150,
      "math-quiz": 200,
      "trivia-quiz": 200,
      "typing-speed": 250,
      "checkers": 300,
      "sudoku": 350,
      "chess": 500
    };

    pointsEarned = gamePoints[gameSlug] || 10; // Default score for unknown games
  }

  // Save game session
  const newSession = new GameSession({
    userId,
    gameSlug,
    score,  // Storing score in the session
    completed,
    pointsEarned,
    timeTaken,
    datePlayed: new Date(),
  });

  await newSession.save();

  // Update leaderboard
  const leaderboard = await Leaderboard.findOne({ userId });

  let updateData: any = {
    $inc: {
      gamesPlayed: 1,
      totalScore: pointsEarned, // Add total points across all games
    },
    $set: {
      lastPlayedGame: gameSlug,
      lastPlayedDate: new Date(),
    },
  };

  // Ensure bestScores object exists
  if (!leaderboard?.bestScores) {
    updateData.$set["bestScores"] = { [gameSlug]: score };
  } else {
    updateData.$max = { [`bestScores.${gameSlug}`]: score }; // Store highest score for that game
  }

  await Leaderboard.findOneAndUpdate(
    { userId },
    updateData,
    { upsert: true, new: true }
  );

  return res.status(201).json({
    message: "Game session created & leaderboard updated",
  });
};


 

export const getRecentPlayedGame = async ( req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  
  const recentGames = await GameSession.findOne({ userId })
    .sort({ datePlayed: -1 })
    .exec();

  if (!recentGames) return res.json({ message: "No recent games found" });
console.log("recent games ", recentGames);

  const game = await Game.findOne({ slug: recentGames?.gameSlug }).exec();
  if (!game) return res.status(404).json({ message: "Game data not found" });

  return res.status(200).json({ message: "Game fetched successfully", game });
};

export const getGameBySlug = async ( req: Request, res: Response): Promise<Response> => {
  const game = await Game.findOne({ slug: req.params.slug });
  if (!game) return res.status(404).json({ message: "Game not found" });
  return res.status(200).json({ game });
};

export const addGame = async (req: Request,res: Response): Promise<Response> => {
  const { name, slug, description, difficulty } = req.body;

  const thumbImg: string | null = req.file?.path ?? null;

  const newGame = new Game({
    name,
    slug,
    description,
    thumbnailImg: thumbImg,
    difficulty,
  });

  await newGame.save();
  return res
    .status(201)
    .json({ message: "Game created successfully", newGame });
};

export const getLeaderboard = async (req: AuthenticatedRequest,res: Response): Promise<Response> => {
  const leaderboardEntries = await Leaderboard.find().limit(20).sort({ bestScore: -1 });

  const userIds: string[] = leaderboardEntries.map((entry:any) =>entry.userId.toString());

  const { data: usersData }: { data: User[] } = await axios.post("http://user-service:5000/api/user/bulk",{ userIds });

  const leaderboardWithUsers = leaderboardEntries.map((entry: any) => {
    const user = usersData.find((user) => user._id === entry.userId.toString());
    return {
      ...entry.toObject(),
      user: user ? { name: user.name, profilePic: user.profilePic } : null,
    };
  });

  return res.status(200).json({
    message: "Leaderboard fetched",
    leaderboard: leaderboardWithUsers,
  });
};
