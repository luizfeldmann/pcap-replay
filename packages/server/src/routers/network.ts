import { Router } from "express";
import { IDocumentedRouter } from "./IDocumentedRouter";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { NetworkController } from "../controllers/network";

const router = Router();

router.get("/interfaces", NetworkController.getInterfaces.handler);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  [`${prefix}/interfaces`]: {
    get: NetworkController.getInterfaces.docs,
  },
});

export const NetworkRouter: IDocumentedRouter = { router, getDocs };
