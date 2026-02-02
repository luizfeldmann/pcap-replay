import { Router } from "express";
import { ReplayController } from "../controllers/replay.js";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { IDocumentedRouter } from "./IDocumentedRouter.js";

const router = Router();

router.get("/", ReplayController.getAll.handler);
router.post("/", ReplayController.createJob.handler);
router.get("/:id", ReplayController.getSingle.handler);
router.patch("/:id", ReplayController.modifyJob.handler);
router.delete("/:id", ReplayController.deleteJob.handler);
router.post("/:id/:command", ReplayController.statusCommand.handler);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  [`${prefix}`]: {
    get: ReplayController.getAll.docs,
    post: ReplayController.createJob.docs,
  },
  [`${prefix}/{id}`]: {
    get: ReplayController.getSingle.docs,
    patch: ReplayController.modifyJob.docs,
    delete: ReplayController.deleteJob.docs,
  },
  [`${prefix}/{command}`]: {
    post: ReplayController.statusCommand.docs,
  },
});

export const ReplayRouter: IDocumentedRouter = { router, getDocs };
