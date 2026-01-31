import { Router } from "express";
import { ReplayController } from "../controllers/replay.js";

const router = Router();

router.get("/", ReplayController.getAll.handler);
router.post("/", ReplayController.createJob.handler);
router.get("/:id", ReplayController.getSingle.handler);
router.patch("/:id", ReplayController.modifyJob.handler);
router.delete("/:id", ReplayController.deleteJob.handler);
router.post("/:id/:command", ReplayController.statusCommand.handler);

const docs = {
  "/jobs/replay": {
    get: ReplayController.getAll.docs,
    post: ReplayController.createJob.docs,
  },
  "/jobs/replay/{id}": {
    get: ReplayController.getSingle.docs,
    patch: ReplayController.modifyJob.docs,
    delete: ReplayController.deleteJob,
  },
  "/jobs/replay/{command}": {
    post: ReplayController.statusCommand.docs,
  },
};

export const ReplayRouter = { router, docs };
