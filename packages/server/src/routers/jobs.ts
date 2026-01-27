import { Router } from "express";
import { ReplayRouter } from "./replay.js";
import { ForwardRouter } from "./forward.js";

const router = Router();

router.use("/replay", ReplayRouter.router);
router.use("/forward", ForwardRouter.router);

const docs = {
  ...ReplayRouter.docs,
  ...ForwardRouter.docs,
};

export const JobsRouter = { router, docs };
