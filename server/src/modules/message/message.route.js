import express from "express";
const messageRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as validations from "./message.validation.js";
import * as controllers from "./message.controller.js";


messageRoutes.post("/",
    middlewares.authMiddleware,
    validations.createMessageValidation,
    middlewares.validationResultMiddleware,
    controllers.createMessageController
);

messageRoutes.get("/:conversationId",
    middlewares.authMiddleware,
    controllers.fetchConversationMessagesController
);

messageRoutes.delete("/:messageId",
    middlewares.authMiddleware,
    controllers.deleteMessageController
);


export default messageRoutes;