import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// api calls here
app.use("/api", registerRoute);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
