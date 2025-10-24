// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MongoString);
//     console.log("MongoDB Connected Successfully");
//   } catch (error) {
//     console.error("MongoDB Connection Failed:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

let cachedDb = null; // cache the connection

const connectDB = async () => {
  if (cachedDb) {
    // Use existing connection
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = conn;
    console.log("MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw new Error(error.message); // don't exit process in serverless
  }
};

export default connectDB;
