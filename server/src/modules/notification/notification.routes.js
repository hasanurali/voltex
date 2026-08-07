import express from "express";
const notificationRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./notification.controller.js";


notificationRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchNotificationController
);

notificationRoutes.patch("/:notificationId/read",
    middlewares.authMiddleware,
    controllers.markNotificationAsReadController
);

notificationRoutes.patch("/notifications/read-all",
    middlewares.authMiddleware,
    controllers.markAllNotificationAsReadController
);

notificationRoutes.delete("/:notificationId",
    middlewares.authMiddleware,
    controllers.deleteNotificationController
);


export default notificationRoutes;