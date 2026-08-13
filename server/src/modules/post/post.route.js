import express from "express";
const postRoutes = express.Router();

import * as middlewares from "../../middlewares/index.js";
import * as validations from "./post.validation.js";
import * as controllers from "./post.controller.js";


postRoutes.post("/",
    middlewares.authMiddleware,
    validations.createPostValidation,
    middlewares.validationResultMiddleware,
    controllers.createPostController
);

postRoutes.get("/",
    middlewares.optionalMiddleware,
    controllers.fetchPostsController
);

postRoutes.get("/:postId",
    controllers.fetchPostDetailsController
);

postRoutes.get("/user/:username",
    controllers.fetchUserPostsController
);

postRoutes.patch("/:postId",
    middlewares.authMiddleware,
    validations.updatePostValidation,
    middlewares.validationResultMiddleware,
    controllers.updatePostController
);

postRoutes.delete("/:postId",
    middlewares.authMiddleware,
    controllers.deletePostController
);


export default postRoutes;