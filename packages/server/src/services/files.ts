import { FileListItem } from "shared";
import { db } from "../models/db.js";
import path from "path";
import fs from "fs/promises";
import { FileRow, FilesTable } from "../models/files.js";
import { eq } from "drizzle-orm";
import { ResourceNotFoundError, UnknownError } from "../utils/error.js";
import { configData } from "../utils/config.js";

//! Transforms from a DB row to a list item DTO
const transformListItem = (row: FileRow): FileListItem => ({
  id: row.id,
  name: row.filename,
  size: row.size,
  time: row.uploadedAt.toISOString(),
});

//! Reads from the DB the list of files
const getFilesList = async (): Promise<FileListItem[]> => {
  const dbFiles = await db.select().from(FilesTable);
  return dbFiles.map(transformListItem);
};

//! Finds a file by it's ID in the DB
const getFileInfo = async (id: string): Promise<FileListItem> => {
  const [dbFile] = await db
    .select()
    .from(FilesTable)
    .where(eq(FilesTable.id, id));

  if (!dbFile) throw new ResourceNotFoundError();

  return transformListItem(dbFile);
};

//! Gets the name of the path on disk
const getFilePathOnDisk = (id: string) =>
  path.resolve(path.join(configData.UPLOAD_DIR, id));

//! Deletes a file from disk
const deleteFile = async (id: string) => {
  // Delete from disk
  const filePath = getFilePathOnDisk(id);
  await fs.unlink(filePath).catch((err) => {
    if (err.code === "ENOENT") throw new ResourceNotFoundError();
    throw new UnknownError(err.message);
  });

  // Delete from DB
  const numRows = await db.delete(FilesTable).where(eq(FilesTable.id, id));
  if (!numRows.changes) throw new ResourceNotFoundError();
};

//! Gets the path to download a file
const downloadFile = async (id: string) => {
  const filePath = getFilePathOnDisk(id);
  await fs.access(filePath).catch((err) => {
    throw new ResourceNotFoundError();
  });

  const fileInfo = await getFileInfo(id);
  return {
    filePath,
    fileName: fileInfo.name,
  };
};

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
