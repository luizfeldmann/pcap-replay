import { Router } from "express";
import { FilesRouter } from "./files.js";
import { JobsRouter } from "./jobs.js";

const router = Router();
router.use("/files", FilesRouter.router);
router.use("/jobs", JobsRouter.router);

const docs = {
  ...FilesRouter.docs,
  ...JobsRouter.docs,
};

export const ApiRouter = { router, docs };
