import jwt from "jsonwebtoken";

import JWT_CONFIG from "../config/jwt.js";

const optionalMiddleware = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return next();
    };

    try {

        const decoded = jwt.verify(token, JWT_CONFIG.ACCESS.KEY);

        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

    } catch (error) {
        // Invalid or expired token.
        // Continue as a guest user.
    };

    next();
};

export default optionalMiddleware;