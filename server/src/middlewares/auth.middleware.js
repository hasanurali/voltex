import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { ApiError } from "../shared/utils/index.js";
import { AUTH_MESSAGES } from "../shared/constants/messages/index.js";
import JWT_CONFIG from "../config/jwt.js";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    const token = req.cookies.accessToken ||
        (
            authHeader?.startsWith("Bearer ") ?
                authHeader.split(/\s+/)[1]
                :
                null
        );

    if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    };

    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS.KEY);

    if (!decoded?.userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    }

    req.user = {
        id: decoded.userId,
        role: decoded.role
    };

    next();
};

export default authMiddleware;