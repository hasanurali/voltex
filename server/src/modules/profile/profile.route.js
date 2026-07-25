import express from "express";
const profileRoutes = express.Router();

import * as controllers from "./profile.controller.js";


profileRoutes.get("/:username",
    controllers.userPublicProfile,
);


export default profileRoutes;