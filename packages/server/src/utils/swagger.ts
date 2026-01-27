import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import packagejson from "../../package.json" with { type: "json" };

//! Setups swagger using the given collection of paths
export const setupSwagger = (app: Express, paths: Record<string, any>) => {
  const openApiSpec = {
    openapi: "3.0.3",
    info: { title: packagejson.name, version: packagejson.version },
    servers: [{ url: "/api" }],
    paths,
  };

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};
