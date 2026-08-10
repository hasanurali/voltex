import express from "express";
const settingRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./setting.controller.js";


settingRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchSettingController
);


export default settingRoutes;