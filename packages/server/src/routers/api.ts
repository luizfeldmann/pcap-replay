import { Router } from "express";
import { FilesRouter } from "./files.js";
import { JobsRouter } from "./jobs.js";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { IDocumentedRouter } from "./IDocumentedRouter.js";
import { NetworkRouter } from "./network.js";

const router = Router();

const FILES_PREFIX = "/files";
router.use(FILES_PREFIX, FilesRouter.router);

const JOBS_PREFIX = "/jobs";
router.use(JOBS_PREFIX, JobsRouter.router);

const NETWORK_PREFIX = "/network";
router.use(NETWORK_PREFIX, NetworkRouter.router);

const getDocs = (): ZodOpenApiPathsObject => ({
  ...FilesRouter.getDocs(FILES_PREFIX),
  ...JobsRouter.getDocs(JOBS_PREFIX),
  ...NetworkRouter.getDocs(NETWORK_PREFIX),
});

export const ApiRouter: IDocumentedRouter = { router, getDocs };
