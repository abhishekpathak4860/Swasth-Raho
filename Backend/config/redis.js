import { Redis } from "@upstash/redis";

let redis;

const connectRedis = async () => {
  try {
    if (!redis) {
      redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      });

      await redis.set("test", "Hello Redis");
      const data = await redis.get("test");

      console.log("Redis Connected Successfully:", data);
    }

    return redis;
  } catch (error) {
    console.error("Redis Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectRedis;
export { redis };
