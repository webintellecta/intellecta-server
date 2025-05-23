import express  from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import gameThumbUpload from "../middleware/gameThumbUpload";
import { isAuthenticate } from "../middleware/isAuth";
import { getLeaderboard, getLeaderboardByUserId } from "../controllers/Game/leaderboardController";
import { addGame, createGameSession, getAllGames, getGameBySlug, getRecentPlayedGame } from "../controllers/Game/gameController";

const gameRouter = express.Router()

gameRouter.get("/allgames", asyncHandler(getAllGames))
gameRouter.get("/:slug", asyncHandler(getGameBySlug))
gameRouter.get("/users/leaderboard", asyncHandler(getLeaderboard))
gameRouter.get("/userbyid/leaderboard", isAuthenticate, asyncHandler(getLeaderboardByUserId))  // userleaderboard
gameRouter.get("/latest/recent-game",isAuthenticate, asyncHandler(getRecentPlayedGame))
gameRouter.post("/create",gameThumbUpload.single("thumbnailImg"), asyncHandler(addGame))
gameRouter.post("/game-session",isAuthenticate, asyncHandler(createGameSession))

export default gameRouter