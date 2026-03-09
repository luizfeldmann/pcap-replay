import { NextFunction, Request, Response } from "express";
import { FilesService } from "../services/files.js";
import { configData } from "../utils/config.js";
import { FileSizeError, FileTypeError, UnknownError } from "../utils/error.js";
import path from "path";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import {
  defaultErrorResponse,
  eventStreamResponse,
  fileDownloadResponse,
  jsonResponse,
} from "../utils/openapi.js";
import {
  FileEventSchema,
  FileListItemSchema,
  FilePatchSchema,
  PaginatedFileListRequestSchema,
  PaginatedFileListResponseSchema,
} from "shared";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { prepareHeadersForSSE, sendEventSSE } from "../events/events.js";
import { FileEvents } from "../events/files.js";

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
    parameters: [
      {
        in: "query",
        name: "limit",
        required: true,
        schema: { type: "integer" },
      },
      {
        in: "query",
        name: "cursor",
        required: false,
        schema: { type: "string" },
      },
    ],
    responses: {
      [StatusCodes.OK]: jsonResponse(PaginatedFileListResponseSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = PaginatedFileListRequestSchema.parse(req.query);
    const listItems = await FilesService.getFilesList(params);
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

// Gets info of a single file
const getFileById = {
  docs: {
    tags: [FILES_TAG],
    summary: "Retrieves data of a single file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.OK]: jsonResponse(FileListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    // Get the file ID from the request
    const params = FileIdSchema.parse(req.params);

    // Get file info from DB
    const file = await FilesService.getFileInfo(params.id);
    resp.json(file);
  },
};

// Download of single file
const downloadFile = {
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

// Modify/update a file
const modifyFile = {
  docs: {
    tags: [FILES_TAG],
    summary: "Modify a file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.CREATED]: jsonResponse(FileListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, resp: Response) => {
    const params = FileIdSchema.parse(req.params);
    const patch = FilePatchSchema.parse(req.body);
    const modified = FilesService.modifyFile(params.id, patch);
    resp.json(modified);
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
  handler: (req: Request, resp: Response) => {
    const params = FileIdSchema.parse(req.params);
    FilesService.deleteFile(params.id);
    resp.sendStatus(StatusCodes.NO_CONTENT);
  },
};

const watchFilesEvents = {
  docs: {
    tags: [FILES_TAG],
    summary: "Streams the mutations in the collection of files",
    parameters: [],
    responses: {
      [StatusCodes.OK]: eventStreamResponse(FileEventSchema),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, res: Response) => {
    prepareHeadersForSSE(res);

    const { unsubscribe } = FileEvents.subscribeToAllFiles((event) =>
      sendEventSSE(res, event),
    );

    res.on("close", unsubscribe);
  },
};

export const FilesController = {
  getFilesList,
  getFileById,
  downloadFile,
  modifyFile,
  deleteFile,
  uploadFile,
  watchFilesEvents,
};
