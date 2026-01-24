import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import http from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import superAdminDashboardDataRoute from "./routes/superAdminRoute.js";
import patientDashboardDataRoute from "./routes/patientDashboardData.js";
import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";
import hospitalDashboardDataRoute from "./routes/hospitalDashboardDataRoute.js";
import hospitalDashboardDataRouteFromServer from "./routes/hospitalDataFromServerRoute.js";
import getTokenRoute from "./routes/getToken.js";
import aiChatRoute from "./routes/aiChat.js";
import { socketHandler } from "./controllers/aiChatController.js";
import { userSocketHandler } from "./controllers/userChatController.js";
import chatRoute from "./routes/chatRoute.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import googleAuthRoute from "./routes/googleAuthRoute.js";

const app = express();
const server = http.createServer(app); // 4. Create Server
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Allowed Origins
const corsOptions = {
  origin: ["https://swasth-raho-9ehr.vercel.app", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

// Socket.io Init
const io = new Server(server, { cors: corsOptions, cookie: true });

// Socket Middleware for Security
io.use((socket, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    // const cookieHeader =
    //   socket.handshake.headers?.cookie || socket.request?.headers?.cookie;
    // console.log(cookieHeader);
    // //  IMPORTANT SAFETY CHECK
    // if (!cookieHeader) {
    //   return next(new Error("Authentication error: No cookies found"));
    // }

    // Socket handshake se cookies nikaalna
    // const cookies = cookie.parse(cookieHeader);
    // const token = cookies.token;

    // for now take token  from frontend(httponly:false)
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    // Token Verify karna
    const decoded = jwt.verify(token, secret);
    socket.user = decoded; // User ki info socket mein save ho gayi
    next();
  } catch (err) {
    next(new Error(`Authentication error: ${err.message}`));
  }
});
// 5. Connect Socket Handler
socketHandler(io);
userSocketHandler(io);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Runnings", timestamp: new Date().toISOString() });
});

// Routes
app.use("/user/auth", getTokenRoute);
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/super-admin", superAdminDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);
app.use("/api/hospital", hospitalDashboardDataRoute);
app.use("/data", hospitalDashboardDataRouteFromServer);
app.use("/ai", aiChatRoute);
app.use("/api/chat", chatRoute);
app.use("/auth", googleAuthRoute);
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
