import { Worker } from "bullmq";

import redis from "../../config/redis.js";
import { sendOtpJob, sendResetPasswordLinkJob } from "./mail.jobs.js";
import { EMAIL_JOB } from "../constants/enums/index.js";
import { log } from "../utils/index.js";


const emailJobs = {
    [EMAIL_JOB.SEND_OTP]: sendOtpJob,
    [EMAIL_JOB.SEND_RESET_PASSWORD_LINK]: sendResetPasswordLinkJob
};

const emailWorker = new Worker("email", async (job) => {

    const handler = emailJobs[job.name];

    if (!handler) {
        throw new Error(`Invalid email job: ${job.name}`);
    }

    await handler(job);
},
    {
        connection: redis,
        concurrency: 5
    }
);

emailWorker.on("completed", (job) => {
    log(`Email job completed: ${job.id}`, "Success");
});

emailWorker.on("failed", (job, error) => {
    log(`Email job failed: ${job?.id}`, error.message)
});