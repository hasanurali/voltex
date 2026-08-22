import { Queue } from "bullmq";

import redis from "../../config/redis.js";

export const emailQueue = new Queue("email", {
    connection: redis
});