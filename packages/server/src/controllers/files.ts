import { NextFunction, Request, Response } from "express";
import { FilesService } from "../services/files.js";
import { configData } from "../utils/config.js";
import { FileSizeError, FileTypeError, UnknownError } from "../utils/error.js";
import path from "path";
import multer from "multer";

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
    summary: "List all files in the server",
  },
  handler: async (req: Request, resp: Response) => {
    resp.json(await FilesService.getFilesList());
  },
};

// Uploading a new file
const uploadFile = {
  docs: {
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
  },
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

    resp.json(
      await FilesService.saveFile(
        req.file.filename,
        req.file.originalname,
        req.file.size,
      ),
    );
  },
};

// Download of single file
const getFileById = {
  docs: {
    summary: "Download a file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
  },
  handler: async (req: Request, resp: Response) => {},
};

// Deleting of one file
const deleteFile = {
  docs: {
    summary: "Delete a file",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
  },
  handler: async (req: Request, resp: Response) => {},
};

export const FilesController = {
  getFilesList,
  getFileById,
  deleteFile,
  uploadFile,
};
