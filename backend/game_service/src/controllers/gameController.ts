import { Request, Response } from "express";
import Game from "../models/gameSchema";
import GameSession from "../models/gameSession";
import { userCache } from "../consumers/userConsumer";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getAllGames = async (req: Request,res: Response): Promise<Response> => {
  const a = userCache

  console.log("faris ", a);
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const games = await Game.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return res.status(200).json({ message: "Game fetched successfully", games });
};


export const getRecentPlayedGame = async (req: AuthenticatedRequest,res: Response): Promise<Response> => {
  const userId = req.user?.id
  
  const recentGames = await GameSession.findOne({userId}).sort({ datePlayed: -1 }).exec();
  if(!recentGames) return res.json({message: "No recent games found"})

  const game = await Game.findOne({slug: recentGames?.gameSlug}).exec();
  if (!game) return res.status(404).json({ message: "Game data not found" });

  return res.status(200).json({ message: "Game fetched successfully", recentGames });
};

export const getGameBySlug = async (req: Request,res: Response): Promise<Response> => {
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
  return res.status(201).json({ message: "Game created successfully", newGame });
};
