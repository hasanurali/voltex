import express from "express";
const reactionRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./reaction.controller.js";


reactionRoutes.post("/",
    middlewares.authMiddleware,
    controllers.createReactionController
);

reactionRoutes.delete("/",
    middlewares.authMiddleware,
    controllers.deleteReactionController
);


export default reactionRoutes;