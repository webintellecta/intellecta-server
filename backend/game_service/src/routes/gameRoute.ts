import express  from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { addGame, createGameSession, getAllGames, getGameBySlug, getLeaderboard, getLeaderboardByUserId, getRecentPlayedGame } from "../controllers/gameController";
import gameThumbUpload from "../middleware/gameThumbUpload";
import { isAuthenticate } from "../middleware/verifyToken";

const gameRouter = express.Router()

gameRouter.get("/allgames", asyncHandler(getAllGames))
gameRouter.get("/:slug", asyncHandler(getGameBySlug))
gameRouter.get("/users/leaderboard", asyncHandler(getLeaderboard))
gameRouter.get("/userbyid/leaderboard", isAuthenticate, asyncHandler(getLeaderboardByUserId))  // userleaderboard
gameRouter.get("/latest/recent-game",isAuthenticate, asyncHandler(getRecentPlayedGame))
gameRouter.post("/create",gameThumbUpload.single("thumbnailImg"), asyncHandler(addGame))
gameRouter.post("/game-session",isAuthenticate, asyncHandler(createGameSession))

export default gameRouter