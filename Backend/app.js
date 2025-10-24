import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import cookieParser from "cookie-parser";
import patientDashboardDataRoute from "./routes/patientDashboardData.js";
import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";

dotenv.config();
const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // frontend URL
//     credentials: true, // allow cookies
//   })
// );
const allowedOrigins = [
  "http://localhost:3000",
  "https://swasth-raho.vercel.app", // backend live
  "https://your-frontend-name.vercel.app", // when you deploy frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());

// api calls here
app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
