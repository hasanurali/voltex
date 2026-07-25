import express from "express";
const profileRoutes = express.Router();

import * as controllers from "./profile.controller.js";
import * as middlewares from "../../middlewares/index.js";
import * as validations from "./profile.validation.js";


profileRoutes.get("/:username",
    controllers.userPublicProfileController,
);

profileRoutes.patch("/",
    middlewares.authMiddleware,
    validations.updateProfileValidation,
    middlewares.validationResultMiddleware,
    controllers.updateProfileController,
);


export default profileRoutes;