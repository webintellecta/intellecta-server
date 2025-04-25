import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
