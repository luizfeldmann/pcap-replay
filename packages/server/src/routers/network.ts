import { Router } from "express";
import { IDocumentedRouter } from "./IDocumentedRouter.js";
import { NetworkController } from "../controllers/network.js";
import { ZodOpenApiPathsObject } from "zod-openapi";

const router = Router();

router.get("/interfaces", NetworkController.getInterfaces.handler);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  [`${prefix}/interfaces`]: {
    get: NetworkController.getInterfaces.docs,
  },
});

export const NetworkRouter: IDocumentedRouter = { router, getDocs };
