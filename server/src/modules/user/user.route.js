import express from "express";
const userRoutes = express.Router();

import * as controllers from "./user.controller.js";
import * as middlewares from "../../middlewares/index.js"


userRoutes.get("/",
    controllers.fetchUsersController,
);

userRoutes.post("/user-statuses",
    middlewares.authMiddleware,
    controllers.checkUserStatusesController
);


export default userRoutes;