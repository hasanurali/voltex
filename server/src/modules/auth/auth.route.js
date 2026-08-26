import express from "express";
const authRoutes = express.Router();

import * as validations from "./auth.validation.js";
import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./auth.controller.js";
import { LIMITER_TIER } from "../../shared/constants/enums/index.js";


const getAuthLimiter = () => middlewares.createRateLimiter(LIMITER_TIER.STRICT,
    'Too many authentication attempts. Please try again after 15 minutes'
);

authRoutes.post("/register",
    getAuthLimiter(),
    validations.registerValidation,
    middlewares.validationResultMiddleware,
    controllers.registerController
);

authRoutes.post("/verify-email",
    getAuthLimiter(),
    validations.otpValidation,
    middlewares.validationResultMiddleware,
    controllers.verifyEmailController
);

authRoutes.post("/resend-otp",
    getAuthLimiter(),
    controllers.resendOtpController
);

authRoutes.post("/login",
    getAuthLimiter(),
    validations.loginValidation,
    middlewares.validationResultMiddleware,
    controllers.loginController
);

authRoutes.post("/logout",
    middlewares.authMiddleware,
    controllers.logoutController
);

authRoutes.post("/refresh-token",
    controllers.refreshTokenController
);

authRoutes.post("/forgot-password",
    getAuthLimiter(),
    validations.forgotPasswordValidation,
    middlewares.validationResultMiddleware,
    controllers.forgotPasswordController
);

authRoutes.post("/reset-password",
    getAuthLimiter(),
    validations.resetPasswordValidation,
    middlewares.validationResultMiddleware,
    controllers.resetPasswordController
);

authRoutes.get("/me",
    middlewares.authMiddleware,
    controllers.currentUserController
);


export default authRoutes;