import express from "express";
const conversationRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./conversation.controller.js";


conversationRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchConversationsController
);

conversationRoutes.get("/:conversationId",
    middlewares.authMiddleware,
    controllers.fetchConversationDetailsController
);

conversationRoutes.patch("/:conversationId/read",
    middlewares.authMiddleware,
    controllers.markConversationMessagesAsReadController
);


export default conversationRoutes;