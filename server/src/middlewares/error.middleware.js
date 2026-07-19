import env from "../config/env.js";
import { log } from "../shared/utils/index.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";

    // handle Mongo / JWT errors
    if (err.name === "CastError") {
        message = "Invalid ID";
        statusCode = 400;
        err.isOperational = true;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 409;
        err.isOperational = true;
    }

    if (err.name === "JsonWebTokenError") {
        message = "Invalid token";
        statusCode = 401;
        err.isOperational = true;
    }

    if (err.name === "TokenExpiredError") {
        message = "Token expired";
        statusCode = 401;
        err.isOperational = true;
    }

    if (env.NODE_ENV === "production" && !err.isOperational) {
        message = "Something went wrong";
    };

    log(`Message: ${message},
         Status: ${statusCode},
         Route: ${err.method} ${err.originalUrl}
         Time: ${new Date().toISOString()}
         Stack: ${err.stack}`);

    return res.status(statusCode).res({
        success: false,
        message,
        errors: err.errors || []
    });

};

export default errorHandler;