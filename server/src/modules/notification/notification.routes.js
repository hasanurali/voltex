import express from "express";
const notificationRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./notification.controller.js";


notificationRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchNotificationController
);


export default notificationRoutes;