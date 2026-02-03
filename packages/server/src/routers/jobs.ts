import { Router } from "express";
import { ReplayRouter } from "./replay.js";
import { ForwardRouter } from "./forward.js";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { IDocumentedRouter } from "./IDocumentedRouter.js";

const router = Router();

const REPLAY_PREFIX = "/replay";
router.use(REPLAY_PREFIX, ReplayRouter.router);

const FORWARD_PREFIX = "/forward";
router.use(FORWARD_PREFIX, ForwardRouter.router);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  ...ReplayRouter.getDocs(`${prefix}${REPLAY_PREFIX}`),
  ...ForwardRouter.getDocs(`${prefix}${FORWARD_PREFIX}`),
});

export const JobsRouter: IDocumentedRouter = { router, getDocs };
