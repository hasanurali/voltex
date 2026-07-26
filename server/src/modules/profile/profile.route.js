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

profileRoutes.patch("/avatar",
    middlewares.authMiddleware,
    validations.updateAvatarValidation,
    middlewares.validationResultMiddleware,
    controllers.updateAvatarController,
);

profileRoutes.patch("/cover-image",
    middlewares.authMiddleware,
    validations.updateCoverImageValidation,
    middlewares.validationResultMiddleware,
    controllers.updateCoverImageController,
);


export default profileRoutes;