import { FileListItem } from "shared";
import { db } from "../models/db.js";
import { FilesTable } from "../models/files.js";

//! Reads from the DB the list of files
const getFilesList = async (): Promise<FileListItem[]> => {
  const dbFiles = await db.select().from(FilesTable);
  return dbFiles.map((f) => ({
    id: f.id,
    name: f.filename,
    size: f.size,
    time: f.uploadedAt.toISOString(),
  }));
};

const deleteFile = (id: string) => {};

const downloadFile = (id: string) => {};

//! Saves a new file entry to the DB and returns the object
const saveFile = async (
  id: string,
  filename: string,
  size: number,
): Promise<FileListItem> => {
  const uploadedAt = new Date();
  await db.insert(FilesTable).values({
    id,
    filename,
    size,
    uploadedAt,
  });

  return {
    id,
    name: filename,
    size,
    time: uploadedAt.toISOString(),
  };
};

export const FilesService = {
  getFilesList,
  deleteFile,
  downloadFile,
  saveFile,
};
