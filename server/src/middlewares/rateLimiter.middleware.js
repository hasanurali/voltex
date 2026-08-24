import rateLimit from "express-rate-limit";

import env from "../config/env.js";

const createRateLimiter = (tier, customMessage) => {

    let windowMs, max;

    switch (tier.toLowerCase()) {
        case 'strict':
            windowMs = Number(env.TIER_STRICT_WINDOW_MS) || 900000; // 15m
            max = Number(env.TIER_STRICT_MAX_REQUEST) || 5;
            break;
        case 'medium':
            windowMs = Number(env.TIER_MEDIUM_WINDOW_MS) || 60000;   // 1m
            max = Number(env.TIER_MEDIUM_MAX_REQUEST) || 30;
            break;
        case 'loose':
        default:
            windowMs = Number(env.TIER_LOOSE_WINDOW_MS) || 600000;  // 10m
            max = Number(env.TIER_LOOSE_MAX_REQUEST) || 1000;
            break;
    }

    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            message: customMessage || "Too many requests. Please try again later",
        },
    });
};

export default createRateLimiter;