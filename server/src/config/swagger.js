import fs from "fs";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = YAML.parse(
    fs.readFileSync("./docs/openapi.yaml", "utf8")
);

const setupSwagger = (app) => {
    app.use("/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
    );
};

export default setupSwagger;