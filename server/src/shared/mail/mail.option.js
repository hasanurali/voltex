export const EMAIL_JOB_OPTIONS = Object.freeze({
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: 100,
    backoff: {
        type: "exponential",
        delay: 2000
    }
});