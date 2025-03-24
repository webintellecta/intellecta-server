import { Request, Response } from "express";
import Game from "../models/gameSchema"

export const getAllGames = async(req:Request, res:Response): Promise<Response>=> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page -1) * limit;
    const games= await Game.find().skip(skip).limit(limit).sort({createdAt: -1})
    return res.status(200).json({message: "Game fetched successfully", games})
}

export const getGameBySlug= async (req: Request, res:Response):Promise<Response>=> {
    const game = await Game.findOne({slug: req.params.slug})
    if(!game) return res.status(404).json({message: "Game not found"})
    return res.status(200).json({game})
}

export const addGame = async(req:Request, res:Response):Promise<Response>=> {
    const {name, slug, description, thumbnailImg, difficulty} = req.body;
    const newGame = new Game({name, slug, description, thumbnailImg, difficulty})
    await newGame.save()
    return res.status(201).json({message: "Game created Success", newGame})
}