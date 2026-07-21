import express from "express";
const authRoutes = express.Router();

import * as validations from "./auth.validation.js";
import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./auth.controller.js";


authRoutes.post("/register",
    validations.registerValidation,
    middlewares.validationResultMiddleware,
    controllers.registerController
);

authRoutes.post("/verify-email",
    validations.otpValidation,
    middlewares.validationResultMiddleware,
    controllers.verifyEmailController
);

authRoutes.post("/resend-otp",
    controllers.resendOtpController
);


export default authRoutes;