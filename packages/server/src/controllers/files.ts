import { Request, Response } from "express";
import { FileListItemSchema } from "shared";

// Listing of all files
const getFilesList = {
  docs: {
    summary: "List all files in the server",
  },
  handler: async (req: Request, resp: Response) => {
    resp.status(200).send("Hello world");
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
  handler: async (req: Request, resp: Response) => {},
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

export default {
  getFilesList,
  getFileById,
  deleteFile,
  uploadFile,
};
