import express from "express";
const followRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./follow.controller.js";


followRoutes.post("/:username",
    middlewares.authMiddleware,
    controllers.followUserController
);

export default followRoutes;