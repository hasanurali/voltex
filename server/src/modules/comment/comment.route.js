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

commentRoutes.get("/post/:postId",
    controllers.fetchCommentController
);

commentRoutes.get("/:commentId/replies",
    controllers.fetchCommentRepliesController
);

commentRoutes.patch("/:commentId",
    middlewares.authMiddleware,
    validations.updateCommentValidation,
    middlewares.validationResultMiddleware,
    controllers.updateCommentController
);

commentRoutes.delete("/:commentId",
    middlewares.authMiddleware,
    controllers.deleteCommentController
);


export default commentRoutes;