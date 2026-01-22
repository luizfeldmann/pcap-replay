import { Router } from "express";
import Files from "./files.js";
import Jobs from "./jobs.js";

const router = Router();
router.use("/files", Files.router);
router.use("/jobs", Jobs.router);

const docs = {
  ...Files.docs,
  ...Jobs.docs,
};

export default { router, docs };
