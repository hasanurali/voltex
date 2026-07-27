import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./docs/openapi.yaml");

const setupSwagger = (app) => {
    app.use("/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
    );
};

export default setupSwagger;