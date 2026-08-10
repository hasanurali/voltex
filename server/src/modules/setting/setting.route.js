import express from "express";
const settingRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as validations from "./setting.validation.js";
import * as controllers from "./setting.controller.js";


settingRoutes.get("/",
    middlewares.authMiddleware,
    controllers.fetchSettingController
);

settingRoutes.patch("/",
    middlewares.authMiddleware,
    validations.updateSettingValidation,
    middlewares.validationResultMiddleware,
    controllers.updateSettingController
);


export default settingRoutes;