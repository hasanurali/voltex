import IORedis from "ioredis";

import env from "./env.js";
import { log } from "../shared/utils/index.js";

const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null
});

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (error) => {
    log(`Redis error: ${error.message}`);
});

export default redis;