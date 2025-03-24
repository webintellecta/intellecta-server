import express  from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { addGame, getAllGames, getGameBySlug, getRecentPlayedGame } from "../controllers/gameController";
import gameThumbUpload from "../middleware/gameThumbUpload";

const gameRouter = express.Router()

gameRouter.get("/allgames", asyncHandler(getAllGames))
gameRouter.get("/:slug", asyncHandler(getGameBySlug))
gameRouter.get("/recent-game", asyncHandler(getRecentPlayedGame))
gameRouter.post("/create",gameThumbUpload.single("thumbnailImg"), asyncHandler(addGame))

export default gameRouter