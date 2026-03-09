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
router.get("/events", FilesController.watchFilesEvents.handler);
router.get("/:id", FilesController.getFileById.handler);
router.patch("/:id", FilesController.modifyFile.handler);
router.delete("/:id", FilesController.deleteFile.handler);
router.get("/download/:id", FilesController.downloadFile.handler);

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({
  [`${prefix}`]: {
    get: FilesController.getFilesList.docs,
    post: FilesController.uploadFile.docs,
  },
  [`${prefix}/events`]: {
    get: FilesController.watchFilesEvents.docs,
  },
  [`${prefix}/{id}`]: {
    get: FilesController.getFileById.docs,
    patch: FilesController.modifyFile.docs,
    delete: FilesController.deleteFile.docs,
  },
  [`${prefix}/download/{id}`]: {
    get: FilesController.downloadFile.docs,
  },
});

export const FilesRouter: IDocumentedRouter = { router, getDocs };
