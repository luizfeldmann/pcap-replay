import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { FilesService } from "../services/files.js";
import { configData } from "../utils/config.js";
import { FileSizeError, FileTypeError, UnknownError } from "../utils/error.js";
import path from "path";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import {
  defaultErrorResponse,
  fileDownloadResponse,
  jsonResponse,
} from "../utils/openapi.js";
import { FileListItemSchema } from "shared";
import { ZodOpenApiOperationObject } from "zod-openapi";

// Tag for API docs
const FILES_TAG = "Files";

// Schema for the file ID
const FileIdSchema = FileListItemSchema.pick({ id: true });

// Helper for file uploads
const upload = multer({
  // Store file in disk
  storage: multer.diskStorage({
    // Use configured upload directory
    destination: configData.UPLOAD_DIR,
    // Save filename will be calculated
    filename: (req, file, cb) => {
      const id = crypto.randomUUID();
      cb(null, id);
    },
  }),
  // Limit upload file size
  limits: {
    // File limit is configured
    fileSize: configData.MAX_FILE_SIZE_MB * 1024 * 2024,
  },
  // File extension validation
  fileFilter: (req, file, cb) => {
    const filetypes = /pcapng|pcap/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (extname) cb(null, true);
    else cb(new FileTypeError());
  },
});

// Listing of all files
const getFilesList = {
  docs: {
    tags: [FILES_TAG],
    summary: "List all files in the server",
    responses: {
      [StatusCodes.OK]: jsonResponse(z.array(FileListItemSchema)),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const listItems = await FilesService.getFilesList();
    resp.json(listItems);
  },
};

// Uploading a new file
const uploadFile = {
  docs: {
    tags: [FILES_TAG],
    summary: "Upload a new file",
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: { type: "string", format: "binary" },
            },
          },
        },
      },
    },
    responses: {
      [StatusCodes.CREATED]: jsonResponse(FileListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  // Error handling middleware for multer
  middleware: (req: Request, resp: Response, next: NextFunction) => {
    upload.single("file")(req, resp, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        next(new FileSizeError());
        return;
      }

      // Fallback with the current error object
      next(err);
    });
  },
  handler: async (req: Request, resp: Response) => {
    if (!req.file) throw new UnknownError();

    const newItem = await FilesService.saveFile(
      req.file.filename,
      req.file.originalname,
      req.file.size,
    );

    resp.status(StatusCodes.CREATED).json(newItem);
  },
};

// Download of single file
const getFileById = {
  docs: {
    tags: [FILES_TAG],
    summary: "Download a file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.OK]: fileDownloadResponse(),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    // Get the file ID from the request
    const params = FileIdSchema.parse(req.params);

    // Get file info from DB
    const { filePath, fileName } = await FilesService.downloadFile(params.id);

    // Serve to client
    resp.download(filePath, fileName);
  },
};

// Deleting of one file
const deleteFile = {
  docs: {
    tags: [FILES_TAG],
    summary: "Delete a file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.NO_CONTENT]: {
        description: "Deleted",
      },
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = FileIdSchema.parse(req.params);
    await FilesService.deleteFile(params.id);
    resp.sendStatus(StatusCodes.NO_CONTENT);
  },
};

export const FilesController = {
  getFilesList,
  getFileById,
  deleteFile,
  uploadFile,
};
