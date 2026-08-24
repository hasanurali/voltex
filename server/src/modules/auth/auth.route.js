import express from "express";
const authRoutes = express.Router();

import * as validations from "./auth.validation.js";
import * as middlewares from "../../middlewares/index.js";
import * as controllers from "./auth.controller.js";
import { LIMITER_TIER } from "../../shared/constants/enums/index.js";


const authLimiter = middlewares.createRateLimiter(LIMITER_TIER.STRICT,
    'Too many authentication attempts. Please try again after 15 minutes'
);


authRoutes.post("/register",
    authLimiter,
    validations.registerValidation,
    middlewares.validationResultMiddleware,
    controllers.registerController
);

authRoutes.post("/verify-email",
    authLimiter,
    validations.otpValidation,
    middlewares.validationResultMiddleware,
    controllers.verifyEmailController
);

authRoutes.post("/resend-otp",
    authLimiter,
    controllers.resendOtpController
);

authRoutes.post("/login",
    authLimiter,
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
    authLimiter,
    validations.forgotPasswordValidation,
    middlewares.validationResultMiddleware,
    controllers.forgotPasswordController
);

authRoutes.post("/reset-password",
    authLimiter,
    validations.resetPasswordValidation,
    middlewares.validationResultMiddleware,
    controllers.resetPasswordController
);

authRoutes.get("/me",
    middlewares.authMiddleware,
    controllers.currentUserController
);


export default authRoutes;