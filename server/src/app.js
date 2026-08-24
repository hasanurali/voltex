import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitizerPkg from 'mongo-sanitizer';
const mongoSanitizer = mongoSanitizerPkg.default || mongoSanitizerPkg;

import { errorHandler } from "./middlewares/index.js";
import setupSwagger from "./config/swagger.js";
import CORS_CONFIG from "./config/cors.js";
import { createRateLimiter } from "./middlewares/index.js";
import { LIMITER_TIER } from "./shared/constants/enums/index.js";

import authRoutes from "./modules/auth/auth.route.js";
import profileRoutes from "./modules/profile/profile.route.js";
import userRoutes from "./modules/user/user.route.js";
import followRoutes from "./modules/follow/follow.route.js";
import postRoutes from "./modules/post/post.route.js";
import commentRoutes from "./modules/comment/comment.route.js";
import reactionRoutes from "./modules/reaction/reaction.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";
import conversationRoutes from "./modules/conversation/conversation.route.js";
import messageRoutes from "./modules/message/message.route.js";
import settingRoutes from "./modules/setting/setting.route.js";
import blockRoutes from "./modules/block/block.route.js";


const app = express();


// Define middlewares
app.use(cors(CORS_CONFIG));
app.use(helmet())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitizer());
app.use(hpp());

// Overwrite native objects
app.use((req, res, next) => {

    if (req.sanitizedBody) {
        req.body = req.sanitizedBody;
    };

    if (req.sanitizedParams) {
        req.params = req.sanitizedParams;
    };

    if (req.sanitizedQuery) {

        Object.defineProperty(req, 'query', {
            value: req.sanitizedQuery,
            writable: true,
            configurable: true,
            enumerable: true
        });
    };

    next();
});

// Add global limiter
const globalLimiter = createRateLimiter(LIMITER_TIER.LOOSE);
app.use("/api/v1", globalLimiter);


// Test Route
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "API Running"
    })
});


// All Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/reactions", reactionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/blocks", blockRoutes);


// Swagger Docs
setupSwagger(app);


// Not Found Route
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
});

// Globle error handler
app.use(errorHandler);

export default app;