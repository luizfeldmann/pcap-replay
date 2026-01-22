import { Router } from "express";
import FilesController from "../controllers/files.js";

const router = Router();

router.get("/", FilesController.getFilesList.handler);
router.post("/", FilesController.uploadFile.handler);
router.get("/:id", FilesController.getFileById.handler);
router.delete("/:id", FilesController.deleteFile.handler);

const docs = {
  "/files": {
    get: FilesController.getFilesList.docs,
    post: FilesController.uploadFile.docs,
  },
  "/files/{id}": {
    get: FilesController.getFileById.docs,
    delete: FilesController.deleteFile.docs,
  },
};

export default { router, docs };
