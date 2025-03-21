import express  from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { addGame, getAllGames, getGameBySlug } from "../controllers/gameController";

const gameRouter = express.Router()

gameRouter.get("/allgames", asyncHandler(getAllGames))
gameRouter.get("/:slug", asyncHandler(getGameBySlug))
gameRouter.post("/create", asyncHandler(addGame))

export default gameRouter