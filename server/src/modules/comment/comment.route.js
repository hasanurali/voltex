import express from "express";
const commentRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as validations from "./comment.validation.js";
import * as controllers from "./comment.controller.js";


commentRoutes.post("/",
    middlewares.authMiddleware,
    validations.createCommentValidation,
    middlewares.validationResultMiddleware,
    controllers.createCommentController
);


export default commentRoutes;