import { Router } from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";

export interface IDocumentedRouter {
  router: Router;
  getDocs(prefix: string): ZodOpenApiPathsObject;
}
