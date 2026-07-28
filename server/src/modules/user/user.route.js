import express from "express";
const userRoutes = express.Router();

import * as controllers from "./user.controller.js";


userRoutes.get("/",
    controllers.fetchUsersController,
);

export default userRoutes;