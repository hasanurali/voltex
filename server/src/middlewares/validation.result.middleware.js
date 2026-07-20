import { validationResult } from "express-validator";
import { StatusCodes } from 'http-status-codes'

import { ApiError } from "../shared/utils/index.js"
import { GENERAL_MESSAGES } from "../shared/constants/messages/index.js"

const validationResultMiddleware = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, GENERAL_MESSAGES.VALIDATION_ERROR, errors.array());
    };

    next();
};

export default validationResultMiddleware;