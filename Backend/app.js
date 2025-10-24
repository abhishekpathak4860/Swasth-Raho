// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/DB.js";
// import registerRoute from "./routes/registerRoute.js";
// import cookieParser from "cookie-parser";
// import patientDashboardDataRoute from "./routes/patientDashboardData.js";
// import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";

// dotenv.config();

// const app = express();
// connectDB();
// // // Allowed origins
// // const allowedOrigins = {
// //   origin: ["https://swasth-raho-9ehr.vercel.app"],
// // };

// // app.use(cors(allowedOrigins));

// // CORS setup
// const allowedOrigins = ["https://swasth-raho-9ehr.vercel.app"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   })
// );

// // Explicitly handle preflight OPTIONS requests
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,PATCH,DELETE,OPTIONS"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200); // important
// });

// // Handle preflight requests
// // app.options("*", cors({ origin: allowedOrigins, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.get("/", (req, res) => res.send("home page"));
// app.use("/api", registerRoute);
// app.use("/patient", patientDashboardDataRoute);
// app.use("/doctor", doctorDashboardDataRoute);

// export default app;

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
connectDB();

// // Allowed frontend origin
// const allowedOrigins = ["https://swasth-raho-9ehr.vercel.app"];

// // CORS middleware
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//     );
//   }

//   // Handle preflight OPTIONS request
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200); // must return 200 for preflight
//   }
//   next();
// });

const allowedOrigin = "https://swasth-raho-9ehr.vercel.app";

// CORS middleware
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("home page"));
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

export default app;
