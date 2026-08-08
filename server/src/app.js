import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import { errorHandler } from "./middlewares/index.js";
import setupSwagger from "./config/swagger.js";

import authRoutes from "./modules/auth/auth.route.js";
import profileRoutes from "./modules/profile/profile.route.js";
import userRoutes from "./modules/user/user.route.js";
import followRoutes from "./modules/follow/follow.route.js";
import postRoutes from "./modules/post/post.route.js";
import commentRoutes from "./modules/comment/comment.route.js";
import reactionRoutes from "./modules/reaction/reaction.route.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import conversationRoutes from "./modules/conversation/conversation.route.js";


const app = express();


// Define middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());


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