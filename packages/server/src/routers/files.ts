import { Router } from "express";
import { FilesController } from "../controllers/files.js";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { IDocumentedRouter } from "./IDocumentedRouter.js";

const router = Router();

router.get("/", FilesController.getFilesList.handler);
router.post(
  "/",
  FilesController.uploadFile.middleware,
  FilesController.uploadFile.handler,
);
router.get("/:id", FilesController.getFileById.handler);
router.delete("/:id", FilesController.deleteFile.handler);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  [`${prefix}`]: {
    get: FilesController.getFilesList.docs,
    post: FilesController.uploadFile.docs,
  },
  [`${prefix}/{id}`]: {
    get: FilesController.getFileById.docs,
    delete: FilesController.deleteFile.docs,
  },
});

export const FilesRouter: IDocumentedRouter = { router, getDocs };
