import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import patientDashboardDataRoute from "./routes/patientDashboardData.js";
import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";
import hospitalDashboardDataRoute from "./routes/hospitalDashboardDataRoute.js";
import hospitalDashboardDataRouteFromServer from "./routes/hospitalDataFromServerRoute.js";
import getTokenRoute from "./routes/getToken.js";
import aiChatRoute from "./routes/aiChat.js";
import { socketHandler } from "./controllers/aiChatController.js";

dotenv.config();
const app = express();
const server = http.createServer(app); // 4. Create Server

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
const corsOptions = {
  origin: ["https://swasth-raho-9ehr.vercel.app", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

// Socket.io Init
const io = new Server(server, { cors: corsOptions });

// Socket Middleware for Security
io.use((socket, next) => {
  try {
    // Socket handshake se cookies nikaalna
    const cookies = cookie.parse(
      socket.handshake.headers.cookie || socket.request.headers.cookie
    );
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    // Token Verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // User ki info socket mein save ho gayi
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});
// 5. Connect Socket Handler
socketHandler(io);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Runnings", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", getTokenRoute);
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);
app.use("/api/hospital", hospitalDashboardDataRoute);
app.use("/data", hospitalDashboardDataRouteFromServer);
app.use("/ai", aiChatRoute);
// userChat
// Global error handler method
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

await connectDB();

// export default app;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with WebSockets`);
});
