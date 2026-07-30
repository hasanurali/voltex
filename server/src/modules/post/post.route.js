import express from "express";
const postRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as validation from "./post.validation.js";
import * as controllers from "./post.controller.js";


postRoutes.post("/",
    middlewares.authMiddleware,
    validation.createPostValidation,
    middlewares.validationResultMiddleware,
    controllers.createPostController
);

export default postRoutes;