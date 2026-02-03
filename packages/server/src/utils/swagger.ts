import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { createDocument, ZodOpenApiPathsObject } from "zod-openapi";
import packagejson from "../../package.json" with { type: "json" };

//! Setups swagger using the given collection of paths
export const setupSwagger = (app: Express, paths: ZodOpenApiPathsObject) => {
  const openApiSpec = createDocument({
    openapi: "3.0.3",
    info: {
      title: packagejson.name,
      version: packagejson.version,
    },
    servers: [{ url: "/api" }],
    paths,
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};
