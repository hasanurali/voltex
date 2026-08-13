import express from "express";
const blockRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./block.controller.js";


blockRoutes.post("/:username",
    middlewares.authMiddleware,
    controllers.blockUserController,
);

blockRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchBlockedUsersController,
);

blockRoutes.delete("/:username",
    middlewares.authMiddleware,
    controllers.unblockUserController,
);


export default blockRoutes;