import { Router } from "express";
import Replay from "./replay.js";
import Forward from "./forward.js";

const router = Router();

router.use("/replay", Replay.router);
router.use("/forward", Forward.router);

const docs = {
  ...Replay.docs,
  ...Forward.docs,
};

export default { router, docs };
