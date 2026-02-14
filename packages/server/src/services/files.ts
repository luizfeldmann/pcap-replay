import {
  FileListItem,
  FilePatch,
  PaginatedFileListRequest,
  PaginatedFileListResponse,
} from "shared";
import { db } from "../models/db.js";
import path from "path";
import fs from "fs/promises";
import { FileRow, FilesTable } from "../models/files.js";
import { eq, lt, desc } from "drizzle-orm";
import {
  RequestValidationError,
  ResourceNotFoundError,
  UnknownError,
} from "../utils/error.js";
import { configData } from "../utils/config.js";
import { getLastItem } from "../utils/utils.js";
import { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core/index.js";

//! Handles FS error from node
const handleFsError = (err: unknown) => {
  if (err && typeof err === "object") {
    if ("code" in err && err.code === "ENOENT")
      throw new ResourceNotFoundError();
    else if ("message" in err && typeof err.message === "string")
      throw new UnknownError(err.message);
  }
  throw new UnknownError();
};

//! Transforms from a DB row to a list item DTO
const transformListItem = (row: FileRow): FileListItem => ({
  id: row.id,
  name: row.filename,
  size: row.size,
  time: row.uploadedAt.toISOString(),
});

//! Reads from the DB the list of files
const getFilesList = async (
  req: PaginatedFileListRequest,
): Promise<PaginatedFileListResponse> => {
  const cursor = req.cursor ? new Date(req.cursor) : new Date();
  const dbFiles = await db
    .select()
    .from(FilesTable)
    .where(lt(FilesTable.uploadedAt, cursor))
    .orderBy(desc(FilesTable.uploadedAt))
    .limit(req.limit);
  return {
    items: dbFiles.map(transformListItem),
    nextCursor: getLastItem(dbFiles)?.uploadedAt.toISOString(),
  };
};

//! Finds a file by it's ID in the DB
const getFileInfo = async (id: string): Promise<FileListItem> => {
  // prettier-ignore
  const [dbFile] = await db
    .select()
    .from(FilesTable)
    .where(eq(FilesTable.id, id));

  if (!dbFile) throw new ResourceNotFoundError();

  return transformListItem(dbFile);
};

const modifyFile = (id: string, patch: FilePatch): FileListItem => {
  // Ensure there is something to be updated
  if (Object.keys(patch).length === 0) throw new RequestValidationError();

  return db.transaction((tx) => {
    // Compute the set of updates based on the data provided by the patch
    const updateValues: SQLiteUpdateSetSource<typeof FilesTable> = {};

    if (patch.name) updateValues.filename = patch.name;

    // Apply update to the DB
    const result = tx
      .update(FilesTable)
      .set(updateValues)
      .where(eq(FilesTable.id, id))
      .run();

    if (!result.changes) throw new ResourceNotFoundError();

    // Read the latest state of the file to return it
    const dbFile = tx
      .select()
      .from(FilesTable)
      .where(eq(FilesTable.id, id))
      .get();

    if (!dbFile) throw new ResourceNotFoundError();

    // Return the updated file
    return transformListItem(dbFile);
  });
};

//! Gets the name of the path on disk
const getFilePathOnDisk = (id: string) =>
  path.resolve(path.join(configData.UPLOAD_DIR, id));

//! Deletes a file from disk
const deleteFile = async (id: string) => {
  // Delete from disk
  const filePath = getFilePathOnDisk(id);
  await fs.unlink(filePath).catch(handleFsError);

  // Delete from DB
  const numRows = await db.delete(FilesTable).where(eq(FilesTable.id, id));
  if (!numRows.changes) throw new ResourceNotFoundError();
};

//! Gets the path to download a file
const downloadFile = async (id: string) => {
  const filePath = getFilePathOnDisk(id);
  await fs.access(filePath).catch(handleFsError);

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
  modifyFile,
  downloadFile,
  saveFile,
};
