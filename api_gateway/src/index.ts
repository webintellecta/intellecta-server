import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ["http://localhost:5173","https://intellecta-web.vercel.app"],
    credentials:true
}));

// app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});